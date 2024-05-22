import React, { useState } from 'react';
import { apiConnector } from '../../../services/apiConnector';
import { globalVariablesEndpoints } from '../../../services/apis';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import Spinner from '../../common/Spinner';

const { 
  DELETE_BLOCKED_DOMAINS_API, 
  DELETE_BLOCKED_WORDS_API, 
  ADD_BLOCKED_DOMAINS_WORDS_API } = globalVariablesEndpoints;

function BlockedFields({ blockedDomains, blockedWords, setBlockedDomains, setBlockedWords }) {
  const { token } = useSelector((state) => state.auth);
  const [selectedBlockedDomains, setSelectedBlockedDomains] = useState([]);
  const [selectedBlockedWords, setSelectedBlockedWords] = useState([]);
  const [newBlockedDomain, setNewBlockedDomain] = useState('');
  const [newBlockedWord, setNewBlockedWord] = useState('');
  const [addDomainloading, setAddDomainLoading] = useState(false);
  const [addWordloading, setAddWordLoading] = useState(false);
  const [delDomainloading, setdelDomainLoading] = useState(false);
  const [delWordloading, setDelWordLoading] = useState(false);

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
    setAddDomainLoading(true)
    if (newBlockedDomain.trim() !== '') {
      try {
        const res = await apiConnector('POST', ADD_BLOCKED_DOMAINS_WORDS_API, 
        { type: 'domain', value: newBlockedDomain }, {
          Authorization: `Bearer ${token}`,
        });
        toast.success('Domain added');
        setBlockedDomains(prevDomains => [...prevDomains, newBlockedDomain]);
        setNewBlockedDomain('');
      } catch (error) {
        toast.error('Error adding domain');
        console.log('Error in adding domain');
      }
    } else {
      toast.error('Please enter a domain');
    }
    setAddDomainLoading(false)
  };

  const handleAddBlockedWord = async () => {
    setAddWordLoading(true)
    if (newBlockedWord.trim() !== '') {
      try {
        const res = await apiConnector('POST', ADD_BLOCKED_DOMAINS_WORDS_API, 
        { type: 'word', value: newBlockedWord }, {
          Authorization: `Bearer ${token}`,
        });
        toast.success('Word added');
        setBlockedWords(prevWords => [...prevWords, newBlockedWord]);
        setNewBlockedWord('');
      } catch (error) {
        toast.error('Error adding word');
        console.log('Error in adding blocked words');
      }
    } else {
      toast.error('Please enter a word');
    }
    setAddWordLoading(false)
  };

  const handleDeleteBlockedDomains = async () => {
    setdelDomainLoading(true)
    if (selectedBlockedDomains.length > 0) {
      try {
        await apiConnector('DELETE', DELETE_BLOCKED_DOMAINS_API, selectedBlockedDomains, {
          Authorization: `Bearer ${token}`,
        });
        toast.success('Blocked domains deleted successfully');
        setBlockedDomains(prevDomains => prevDomains.filter(domain => !selectedBlockedDomains.includes(domain)));
        setSelectedBlockedDomains([]);
      } catch (error) {
        console.log('Error in deleting domains');
      }
    } else {
      toast.error('Select at least 1 domain to delete');
    }
    setdelDomainLoading(false)
  };

  const handleDeleteBlockedWords = async () => {
    setDelWordLoading(true)
    if (selectedBlockedWords.length > 0) {
      try {
        await apiConnector('DELETE', DELETE_BLOCKED_WORDS_API, selectedBlockedWords, {
          Authorization: `Bearer ${token}`,
        });
        toast.success('Blocked words deleted successfully');
        setBlockedWords(prevWords => prevWords.filter(word => !selectedBlockedWords.includes(word)));
        setSelectedBlockedWords([]);
      } catch (error) {
        console.log('Error in deleting blocked words');
      }
    } else {
      toast.error('Select at least 1 blocked word to delete');
    }
    setDelWordLoading(false)
  };

  const handleSelectAllDomains = () => {
    const allDomains = blockedDomains.filter(domain => domain.toLowerCase().includes(newBlockedDomain.toLowerCase()));
    setSelectedBlockedDomains(selectedBlockedDomains.length === allDomains.length ? [] : allDomains);
  };

  const handleSelectAllWords = () => {
    const allWords = blockedWords.filter(word => word.toLowerCase().includes(newBlockedWord.toLowerCase()));
    setSelectedBlockedWords(selectedBlockedWords.length === allWords.length ? [] : allWords);
  };

  const filteredDomains = blockedDomains.filter(domain => domain.toLowerCase().includes(newBlockedDomain.toLowerCase()));
  const filteredWords = blockedWords.filter(word => word.toLowerCase().includes(newBlockedWord.toLowerCase()));

  return (
    <div className="space-y-6 mt-4">
      <div className='bg-white border border-gray-300 shadow-sm rounded-md p-6'>
        <h2 className="text-lg font-semibold mb-2 text-sky-400">Blocked Domains</h2>
        <div className="flex items-center lg:flex-row flex-col xs:items-start my-2 gap-2">
          <input
            type="text"
            value={newBlockedDomain}
            onChange={(e) => setNewBlockedDomain(e.target.value)}
            placeholder="Enter domain"
            className="shadow appearance-none border rounded xs:w-[80vw] lg:w-[450px] py-2 px-3
           text-gray-700 leading-tight border-gray-300 focus:outline-none focus:shadow-outline"
          />
        <div className='flex gap-2'>
        <button onClick={handleAddBlockedDomain} 
             className="bg-blue-500 hover:bg-blue-400 flex gap-2 text-white 
              font-bold py-1 px-4 rounded">
            {addDomainloading ? <div className='flex items-center justify-center'><Spinner/></div> : "Add"}
          </button>
          <button onClick={handleSelectAllDomains} 
            className="bg-gray-500 hover:bg-gray-400 flex gap-2 text-white 
              font-bold py-1 px-4 rounded">
            {selectedBlockedDomains.length === filteredDomains.length ? 'Deselect All' : 'Select All'}
          </button>
          <button
            onClick={handleDeleteBlockedDomains}
            className="bg-red-500 hover:bg-red-600 flex gap-2 text-white 
              font-bold py-1 px-4 rounded"
            disabled={selectedBlockedDomains.length === 0}
          >
            {delDomainloading ? <div className='flex items-center justify-center'><Spinner/></div> : "Delete"}
          </button>
        </div>
        </div>
        <ul className="grid grid-cols-4 xs:grid-cols-2 gap-2">
          {filteredDomains.map((domain, index) => (
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
      </div>

      <div className='bg-white border border-gray-300 shadow-sm rounded-md p-6'>
        <h2 className="text-lg font-semibold mb-2 text-sky-400">Blocked Words</h2>
        <div className="flex  flex-col lg:flex-row items-center my-2 gap-2 xs:items-start">
          <input
            type="text"
            value={newBlockedWord}
            onChange={(e) => setNewBlockedWord(e.target.value)}
            placeholder="Enter word"
            className="shadow appearance-none border rounded xs:w-[80vw] lg:w-[450px] py-2 px-3
           text-gray-700 leading-tight border-gray-300 focus:outline-none focus:shadow-outline"
          />
          <div className='flex gap-2'>
          <button onClick={handleAddBlockedWord} 
            className="bg-blue-500 hover:bg-blue-600 flex gap-2 text-white 
              font-bold py-1 px-4 rounded">
            {addWordloading ? <div className='flex items-center justify-center'><Spinner/></div> : "Add"}
          </button>
          <button onClick={handleSelectAllWords} 
            className="bg-gray-500 hover:bg-gray-600 flex gap-2 text-white 
              font-bold py-1 px-4 rounded">
            {selectedBlockedWords.length === filteredWords.length ? 'Deselect All' : 'Select All'}
          </button>
          <button
            onClick={handleDeleteBlockedWords}
            className="bg-red-500 hover:bg-red-600 flex gap-2 text-white 
              font-bold py-1 px-4 rounded"
            disabled={selectedBlockedWords.length === 0}
          >
            {delWordloading ? <div className='flex items-center justify-center'><Spinner/></div> : "Delete"}
          </button>
          </div>
        </div>
        <ul className="grid grid-cols-4 xs:grid-cols-2 gap-2">
          {filteredWords.map((word, index) => (
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
      </div>
    </div>
  );
}

export default BlockedFields;
