import React, { useState, useEffect } from 'react';
import { apiConnector } from '../../services/apiConnector';
import { panelOptionsEndpoints } from "../../services/apis";
import { FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from "react-hot-toast";

const { GET_PANEL_OPTIONS_API, ADD_PANEL_OPTIONS_API, DELETE_PANEL_OPTIONS_API } = panelOptionsEndpoints;

function PanelOptions() {
    const { token } = useSelector((state) => state.auth);
    const [panelOptions, setPanelOptions] = useState([]);
    const [newOptionName, setNewOptionName] = useState('');
    const [newOptionIcon, setNewOptionIcon] = useState('');
    const [newRedirectionUrl, setNewRedirectionUrl] = useState('');

    const fetchPanelOptions = async () => {
        try {
            const response = await apiConnector("GET", GET_PANEL_OPTIONS_API, null, { Authorization: `Bearer ${token}` });
            setPanelOptions(response.data);
        } catch (error) {
            toast.error("Failed to fetch panel options");
            console.error('Error fetching panel options:', error);
        }
    };

    useEffect(() => {
        fetchPanelOptions();
    }, []);

    const handleAddPanelOption = async () => {
        try {
            const response = await apiConnector("POST", ADD_PANEL_OPTIONS_API, {
                optionName: newOptionName,
                optionIcon: newOptionIcon,
                redirectionUrl: newRedirectionUrl,
            }, { Authorization: `Bearer ${token}` });
            setPanelOptions([...panelOptions, response.data]);
            toast.success("Panel option added successfully");
            setNewOptionName('');
            setNewOptionIcon('');
            setNewRedirectionUrl('');
        } catch (error) {
            toast.error("Failed to add panel option");
            console.error('Error adding panel option:', error);
        }
    };

    const handleDeletePanelOption = async (id) => {
        try {
            await apiConnector("DELETE", `${DELETE_PANEL_OPTIONS_API}/${id}`, null, { Authorization: `Bearer ${token}` });
            setPanelOptions(panelOptions.filter(option => option._id !== id));
            toast.success("Panel option deleted successfully");
        } catch (error) {
            toast.error("Failed to delete panel option");
            console.error('Error deleting panel option:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Add Panel Option</h2>
            <div className="flex mb-4">
                <input
                    type="text"
                    value={newOptionName}
                    onChange={(e) => setNewOptionName(e.target.value)}
                    placeholder="Option Name"
                    className="px-4 py-2 border border-pure-greys-300 rounded mr-2"
                />
                <input
                    type="text"
                    value={newOptionIcon}
                    onChange={(e) => setNewOptionIcon(e.target.value)}
                    placeholder="Option Icon"
                    className="px-4 py-2 border border-pure-greys-300 rounded mr-2"
                />
                <input
                    type="text"
                    value={newRedirectionUrl}
                    onChange={(e) => setNewRedirectionUrl(e.target.value)}
                    placeholder="Redirection URL"
                    className="px-4 py-2 border border-pure-greys-300 rounded mr-2"
                />
                <button onClick={handleAddPanelOption} className="px-4 py-2 bg-black text-white-25 rounded">Add</button>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Panel Options</h2>
            <ul>
                {panelOptions.map(option => (
                    <li key={option._id} className="flex justify-between border-b py-2">
                        <span className='mr-4'>{option.optionName}</span>
                        <span className='mr-16'>{option.redirectionUrl}</span>
                        <span >{option.optionIcon}</span>

                        <button onClick={() => handleDeletePanelOption(option._id)} className="text-red-500 hover:text-red-600">
                            <FaTrash />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PanelOptions;
