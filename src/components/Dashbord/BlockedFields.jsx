import React, { useState } from 'react';
import { apiConnector } from '../../services/apiConnector';
import { globalVariablesEndpoints } from "../../services/apis";
import { useSelector } from 'react-redux';
import { toast } from "react-hot-toast";

const {
    DELETE_BLOCKED_DOMAINS_API,
    DELETE_BLOCKED_WORDS_API,
    ADD_BLOCKED_DOMAINS_WORDS_API,
} = globalVariablesEndpoints;

function BlockedFields({ blockedDomains, blockedWords, setBlockedDomains, setBlockedWords }) {
    const { token } = useSelector((state) => state.auth);
    const [selectedBlockedDomains, setSelectedBlockedDomains] = useState([]);
    const [selectedBlockedWords, setSelectedBlockedWords] = useState([]);
    const [newBlockedDomain, setNewBlockedDomain] = useState('');
    const [newBlockedWord, setNewBlockedWord] = useState('');

    const handleCheckboxChange = (e, type, value) => {
        if (type === 'blockedDomains') {
            if (e.target.checked) {
                setSelectedBlockedDomains(prevState => [...prevState, value]);
            } else {
                setSelectedBlockedDomains(prevState => prevState.filter(domain => domain !== value));
            }
        } else if (type === 'blockedWords') {
            if (e.target.checked) {
                setSelectedBlockedWords(prevState => [...prevState, value]);
            } else {
                setSelectedBlockedWords(prevState => prevState.filter(word => word !== value));
            }
        }
    };

    const handleAddBlockedDomain = async () => {
        if (newBlockedDomain.trim() !== '') {
            try{
                const res = await apiConnector("POST", ADD_BLOCKED_DOMAINS_WORDS_API, { type: 'domain', value: newBlockedDomain }, {
                    Authorization: `Bearer ${token}`,
                })
                toast.success("added");
                setBlockedDomains(prevDomains => [...prevDomains, newBlockedDomain]);
                setNewBlockedDomain('');
            } catch(error){
                toast.error("error")
                console.log("Error in adding domain")
            }   
        } else{
            toast.success("Please enter domain")
        }
    };

    const handleAddBlockedWord = async() => {
        if (newBlockedWord.trim() !== '') {
            try{
                const res = await  apiConnector("POST", ADD_BLOCKED_DOMAINS_WORDS_API, { type: 'word', value: newBlockedWord }, {
                    Authorization: `Bearer ${token}`,
                });
                toast.success("added");
                setBlockedWords(prevWords => [...prevWords, newBlockedWord]);
                setNewBlockedWord('');
            }catch(error){
                console.log("Error in  adding bloced words")
            } 
        }else{
            toast.success("Please enter word")
        }
    };

    const handleDeleteBlockedDomains = async() => {
        if (selectedBlockedDomains.length > 0) {
             try{
               await apiConnector("DELETE", DELETE_BLOCKED_DOMAINS_API, selectedBlockedDomains, {
                Authorization: `Bearer ${token}`,
            });
            toast.success("Blocked domains deleted successfully");
            setBlockedDomains(prevDomains => prevDomains.filter(domain => !selectedBlockedDomains.includes(domain)));
            setSelectedBlockedDomains([]);
            }catch(error){
                console.log("Error in deleting domains")
            }
        } else{
            toast.success("Select atleast 1 domain to delete")
        }
    };

    const handleDeleteBlockedWords = async () => {
        if (selectedBlockedWords.length > 0) {
            try{
               await apiConnector("DELETE", DELETE_BLOCKED_WORDS_API, selectedBlockedWords, {
                    Authorization: `Bearer ${token}`,
                });
                toast.success("Blocked words deleted successfully");
                setBlockedWords(prevWords => prevWords.filter(word => !selectedBlockedWords.includes(word)));
                setSelectedBlockedWords([]);
            }catch(error){
                console.log("Error in deleting blocked words")
            }
        } else{
            toast.success("Select atleast 1 blocked words to delete")
        }
    };

    return (
        <div className="space-y-6 mt-4">
            <div>
                <h2 className="text-lg font-semibold mb-2">Blocked Domains</h2>
                <div className="flex items-center mt-2">
                    <input
                        type="text"
                        value={newBlockedDomain}
                        onChange={(e) => setNewBlockedDomain(e.target.value)}
                        placeholder="Enter a new domain"
                        className="border border-gray-300 rounded-md px-2 py-1 mr-2"
                    />
                    <button
                        onClick={handleAddBlockedDomain}
                        className="bg-black text-white-25 rounded-md px-4 py-2"
                    >
                        Add
                    </button>
                </div>
                <ul className="grid grid-cols-4 gap-2">
                    {blockedDomains.map((domain, index) => (
                        <li key={index} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedBlockedDomains.includes(domain)}
                                onChange={(e) => handleCheckboxChange(e, 'blockedDomains', domain)}
                                className="form-checkbox mr-2"
                            />
                            <span>{domain}</span>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={handleDeleteBlockedDomains}
                    className="bg-red-500 text-white-25 rounded-md px-4 py-2 mt-2"
                    disabled={selectedBlockedDomains.length === 0}
                >
                    Delete
                </button>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">Blocked Words</h2>
                <div className="flex items-center mt-2">
                    <input
                        type="text"
                        value={newBlockedWord}
                        onChange={(e) => setNewBlockedWord(e.target.value)}
                        placeholder="Enter a new word"
                        className="border border-gray-300 rounded-md px-2 py-1 mr-2"
                    />
                    <button
                        onClick={handleAddBlockedWord}
                        className="bg-black text-white-25 rounded-md px-4 py-2"
                    >
                        Add
                    </button>
                </div>
                <ul className="grid grid-cols-4 gap-2">
                    {blockedWords.map((word, index) => (
                        <li key={index} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedBlockedWords.includes(word)}
                                onChange={(e) => handleCheckboxChange(e, 'blockedWords', word)}
                                className="form-checkbox mr-2"
                            />
                            <span>{word}</span>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={handleDeleteBlockedWords}
                    className="bg-red-500 text-white-25 rounded-md px-4 py-2 mt-2"
                    disabled={selectedBlockedWords.length === 0}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default BlockedFields;