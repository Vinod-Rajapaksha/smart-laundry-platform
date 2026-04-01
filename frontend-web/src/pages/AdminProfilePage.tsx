import React from 'react';
import EditProfileModal from '../features/dashboard/EditProfileModal';

const AdminProfilePage: React.FC = () => {
    return <EditProfileModal isOpen={true} onClose={() => window.location.href = '/admin'} />;
};

export default AdminProfilePage;
