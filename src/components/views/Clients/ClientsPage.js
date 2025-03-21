import React, {useEffect, useState} from 'react';
import Clients from './Clients';
import AddClientForm from './AddClient';
import ClientDetails from './ClientDetails';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const ClientsPage = () => {
    const [activeTab, setActiveTab] = useState('viewClients');
    const [dynamicTabs, setDynamicTabs] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const state = location.state;

        if (state?.clientId) {
            const tabId = `clientDetail-${state.clientId}`;
            const tabLabel = state.clientName || `Client #${state.clientId}`;

            setDynamicTabs((prevTabs) => {
                const existingTab = prevTabs.find((tab) => tab.id === tabId);
                if (existingTab) {
                    if (existingTab.label !== tabLabel) {
                        return prevTabs.map((tab) =>
                            tab.id === tabId ? { ...tab, label: tabLabel } : tab
                        );
                    }
                    return prevTabs;
                }
                return [
                    ...prevTabs,
                    {
                        id: tabId,
                        label: tabLabel,
                        component: (
                            <ClientDetails
                                clientId={state.clientId}
                                onClose={() => handleCloseTab(tabId)}
                            />
                        ),
                    },
                ];
            });

            setActiveTab(tabId);
        }
    }, [location.state]);

    const handleOpenClientDetails = (client) => {
        const tabId = `clientDetail-${client.id}`;
        const tabLabel = client.displayName;

        setDynamicTabs([
            {
                id: tabId,
                label: tabLabel,
                component: (
                    <ClientDetails
                        clientId={client.id}
                        onClose={() => handleCloseTab(tabId)}
                    />
                ),
            },
        ]);
        setActiveTab(tabId);
    };

    const handleCloseTab = (tabId) => {
        setDynamicTabs([]);
        if (activeTab === tabId) {
            setActiveTab('viewClients');
        }
    };

    const renderTabContent = () => {
        if (activeTab === 'viewClients') {
            return <Clients onRowClick={handleOpenClientDetails} />;
        } else if (activeTab === 'addClient') {
            return <AddClientForm />;
        } else if (activeTab === 'importClients') {
            navigate('/bulk-imports/clients');
            return null;
        } else {
            const activeDynamicTab = dynamicTabs.find((tab) => tab.id === activeTab);
            return activeDynamicTab ? activeDynamicTab.component : null;
        }
    };

    return (
        <div className="neighbor-element users-page-screen ">
            <h2 className="users-page-head">
                <Link to="/dashboard" className="breadcrumb-link">Dashboard </Link> . Clients
            </h2>

            <div className="users-tab-container">
                <button
                    className={`users-tab-button ${activeTab === 'viewClients' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewClients')}
                >
                    View Clients
                </button>
                {dynamicTabs.map((tab) => (
                    <div key={tab.id} className="dynamic-tab">
                        <button
                            className={`users-tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                        <button
                            className="close-dynamic-tab"
                            onClick={() => handleCloseTab(tab.id)}
                        >
                            Close
                        </button>
                    </div>
                ))}
                <button
                    className={`users-tab-button ${activeTab === 'addClient' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addClient')}
                >
                    Add Client
                </button>
                <button
                    className={`users-tab-button ${activeTab === 'importClients' ? 'active' : ''}`}
                    onClick={() => setActiveTab('importClients')}
                >
                    Import Clients
                </button>
            </div>

            <div className="users-tab-content">{renderTabContent()}</div>
        </div>
    );
};

export default ClientsPage;
