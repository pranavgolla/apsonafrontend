import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const lightModeStyles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
  },
  form: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.8rem',
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  buttonDelete: {
    backgroundColor: '#dc3545',
    color: 'white',
    marginLeft: '10px',
  },
  buttonEdit: {
    backgroundColor: '#ffc107',
    color: 'black',
    marginLeft: '10px',

  },
  noteList: {
    listStyle: 'none',
    padding: 0,
  },
  noteItem: {
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switch: {
    display: 'inline-block',
    width: '34px',
    height: '20px',
    position: 'relative',
    background: '#ccc',
    borderRadius: '20px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  switchToggle: {
    position: 'absolute',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    background: 'white',
    top: '3px',
    left: '3px',
    transition: 'left 0.3s',
  },
  switchOn: {
    left: '17px',
    background: '#007bff',
  },
  tabContainer: {
    marginBottom: '1rem',
  },
  tab: {
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginRight: '0.5rem',
    display: 'inline-block',
  },
  activeTab: {
    backgroundColor: '#007bff',
    color: 'white',
  },
};

const darkModeStyles = {
  container: {
    padding: '2rem',
    backgroundColor: '#333',
    minHeight: '100vh',
    color: '#fff',
  },
  form: {
    background: '#444',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    marginBottom: '2rem',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.8rem',
    marginBottom: '1rem',
    border: '1px solid #666',
    borderRadius: '4px',
    boxSizing: 'border-box',
    backgroundColor: '#555',
    color: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  buttonDelete: {
    backgroundColor: '#dc3545',
    color: 'white',
    marginLeft: '10px',
  },
  buttonEdit: {
    backgroundColor: '#ffc107',
    color: 'black',
    marginLeft: '10px',

  },
  noteList: {
    listStyle: 'none',
    padding: 0,
  },
  noteItem: {
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#444',
    color: '#fff',
  },
  switch: {
    display: 'inline-block',
    width: '34px',
    height: '20px',
    position: 'relative',
    background: '#ccc',
    borderRadius: '20px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  switchToggle: {
    position: 'absolute',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    background: 'white',
    top: '3px',
    left: '3px',
    transition: 'left 0.3s',
  },
  switchOn: {
    left: '17px',
    background: '#007bff',
  },
  tabContainer: {
    marginBottom: '1rem',
  },
  tab: {
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    border: '1px solid #666',
    borderRadius: '4px',
    marginRight: '0.5rem',
    display: 'inline-block',
  },
  activeTab: {
    backgroundColor: '#007bff',
    color: 'white',
  },
};

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isArchived, setIsArchived] = useState(false);
  const [editId, setEditId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const getUserEmailFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.user.email;
  };

  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get('/api/notes', {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
        params: {
          userEmail: getUserEmailFromToken(),
        },
      });
      setNotes(res.data || []);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const noteData = {
        content,
        tags: tags.split(',').map((tag) => tag.trim()),
        isArchived,
        userEmail: getUserEmailFromToken(),
      };

      if (editId) {
        await axios.put(`/api/notes/${editId}`, noteData, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
      } else {
        await axios.post('/api/notes', noteData, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
      }
      setContent('');
      setTags('');
      setIsArchived(false);
      setEditId(null);
      fetchNotes();
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    }
  };

  const onDelete = async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
        data: {
          userEmail: getUserEmailFromToken(),
        },
      });
      fetchNotes();
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    }
  };

  const onEdit = (note) => {
    setContent(note.content);
    setTags((note.tags || []).join(', '));
    setIsArchived(note.isArchived || false);
    setEditId(note._id);
  };

  const toggleArchive = async (id, archiveStatus) => {
    try {
      await axios.put(
        `/api/notes/${id}`,
        {
          isArchived: archiveStatus,
          userEmail: getUserEmailFromToken(),
        },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        }
      );
      fetchNotes();
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    }
  };

  const currentStyles = darkMode ? darkModeStyles : lightModeStyles;

  // Updated filtering logic
  const filteredNotes = notes
    .filter((note) =>
      activeTab === 'active'
        ? !note.isArchived
        : note.isArchived
    )
    .filter((note) =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.tags && note.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    );

  return (
    <div style={currentStyles.container}>
      <Navbar />
      <div style={currentStyles.form}>
        <div className='heading'>
        <h1 className='headingName'>Notes</h1>
        <div
            style={{
              ...currentStyles.switch,
              backgroundColor: darkMode ? '#007bff' : '#ccc',
            }}
            onClick={toggleDarkMode}
          >
            <div
              style={{
                ...currentStyles.switchToggle,
                ...(darkMode ? currentStyles.switchOn : {}),
              }}
            />
          </div>
          </div>
        <form onSubmit={onSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={currentStyles.textarea}
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            style={currentStyles.textarea}
          />
          <div>
            {editId?<label style={{ color: darkMode ? '#fff' : '#000' }}>
              <input
                type="checkbox"
                checked={isArchived}
                onChange={(e) => setIsArchived(e.target.checked)}
              />
              Archived
            </label>:null}
            
          </div>
          <button type="submit" style={currentStyles.button}>
            {editId ? 'Update Note' : 'Add Note'}
          </button>
          
        </form>
      </div>
      <div style={currentStyles.tabContainer}>
        <div
          style={{
            ...currentStyles.tab,
            ...(activeTab === 'active' ? currentStyles.activeTab : {}),
          }}
          onClick={() => setActiveTab('active')}
        >
          Active Notes
        </div>
        <div
          style={{
            ...currentStyles.tab,
            ...(activeTab === 'archived' ? currentStyles.activeTab : {}),
          }}
          onClick={() => setActiveTab('archived')}
        >
          Archived Notes
        </div>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes..."
          style={currentStyles.textarea}
        />
      </div>
      <ul style={currentStyles.noteList}>
        {filteredNotes.map((note) => (
          <li
            key={note._id}
            style={{
              ...currentStyles.noteItem,
              background: darkMode ? '#444' : '#fff',
            }}
          >
            <div>
              <p>{note.content}</p>
              <p style={{ color: '#007bff' }}>Tags: {(note.tags || []).join(', ')}</p>
              {note.isArchived && <p style={{ color: '#dc3545' }}>Archived</p>}
            </div>
            <div>
              <button
                onClick={() => toggleArchive(note._id, !note.isArchived)}
                style={{
                  ...currentStyles.button,
                  backgroundColor: note.isArchived ? '#ffc107' : '#28a745',
                  color: '#fff',
                }}
              >
                {note.isArchived ? 'Unarchive' : 'Archive'}
              </button>
              <button
                onClick={() => onEdit(note)}
                style={{ ...currentStyles.button, ...currentStyles.buttonEdit }}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(note._id)}
                style={{
                  ...currentStyles.button,
                  ...currentStyles.buttonDelete,
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;


