const API_URL = 'http://localhost:5000/api/inventory';

async function testDeduction() {
    console.log("🧪 Starting Stock Deduction Test...\n");

    try {
        // 1. Fetch current items to find one we can test with
        const resItems = await fetch(`${API_URL}/items`);
        const jsonItems = await resItems.json();

        if (!jsonItems.data || jsonItems.data.length === 0) {
            console.log("❌ No items found in the database. Please add an item first.");
            return;
        }

        const itemToTest = jsonItems.data[0];
        console.log(`📦 Found Item: [${itemToTest.id}] ${itemToTest.name}`);
        console.log(`📊 Current Stock: ${itemToTest.stock}\n`);

        // We will try to deduct a small amount. 
        // We'll pick a safe unit deduction based on whatever unit the stock uses.
        const stockParts = itemToTest.stock.trim().split(/\s+/);
        const stockUnit = (stockParts[1] || 'units').toLowerCase();

        let deductAmount = 1;
        let deductUnit = stockUnit;

        // If it's Kg or L, we deduct a small metric like grams or milliliters to prove conversion works.
        if (stockUnit === 'kg') {
            deductAmount = 500;
            deductUnit = 'g';
            console.log(`⚙️  Will attempt to deduct: ${deductAmount} ${deductUnit}`);
        } else if (stockUnit === 'l') {
            deductAmount = 250;
            deductUnit = 'mL';
            console.log(`⚙️  Will attempt to deduct: ${deductAmount} ${deductUnit}`);
        } else {
            console.log(`⚙️  Will attempt to deduct: ${deductAmount} ${deductUnit}`);
        }

        // 2. Hit the deduct endpoint
        console.log(`\n🚀 Sending POST request to ${API_URL}/items/${itemToTest.id}/deduct`);
        const resDeduct = await fetch(`${API_URL}/items/${itemToTest.id}/deduct`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: deductAmount, unit: deductUnit })
        });

        const jDeduct = await resDeduct.json();

        if (!resDeduct.ok) {
            console.log(`❌ Deduction failed: ${jDeduct.message || 'Unknown Error'}`);
            return;
        }

        console.log(`\n✅ Deduction Successful!`);
        console.log(`🎉 New Updated Stock: ${jDeduct.data.stock}`);

    } catch (e) {
        console.error("❌ Test crashed:", e);
    }
}

testDeduction();
