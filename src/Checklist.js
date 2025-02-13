import React, { useState, useEffect, useCallback } from 'react';

function Checklist() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [noteIndex, setNoteIndex] = useState(null);

  const handleDeleteLastItem = useCallback(() => {
    if (items.length > 0) {
      setItems(prevItems => prevItems.slice(0, -1));
    }
  }, [items]);

  const handleSaveEdit = useCallback(() => {
    setItems(prevItems => prevItems.map((item, index) => {
      if (index === editIndex) {
        return { ...item, text: editText };
      }
      return item;
    }));
    setEditIndex(null);
    setEditText('');
  }, [editIndex, editText]);

  const handleSaveNote = useCallback(() => {
    setItems(prevItems => prevItems.map((item, index) => {
      if (index === noteIndex) {
        return { ...item, note: noteText };
      }
      return item;
    }));
    setNoteIndex(null);
    setNoteText('');
  }, [noteIndex, noteText]);

  const handleCheckItem = useCallback((index) => {
    setItems(items.map((item, i) => {
        if (i === index) {
            return { ...item, checked: !item.checked };
        }
        return item;
    }));
}, [items]);

const handleDeleteItem = useCallback((index) => {
    setItems(items.filter((_, i) => i !== index));
}, [items]);

const handleEditItem = useCallback((index) => {
    setEditIndex(index);
    setEditText(items[index].text);
}, [items]);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('checklistItems'));
    if (savedItems) {
      setItems(savedItems);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('checklistItems', JSON.stringify(items));
  }, [items]);

  const handleAddItem = useCallback(() => {
    if (newItem.trim() !== '') {
      setItems(prevItems => [...prevItems, { text: newItem, checked: false, note: '', showNote: false }]);
      setNewItem('');
    }
  }, [newItem]);

  const handleAddNote = useCallback((index) => {
    setNoteIndex(index);
    setNoteText(items[index].note);
  }, [items]);

  const handleItemClick = useCallback((index) => {
    setItems(prevItems => prevItems.map((item, i) => {
      if (i === index) {
        return { ...item, showNote: !item.showNote };
      }
      return item;
    }));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleAddItem();
      } else if (event.key === 'Delete') {
        handleDeleteLastItem();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleAddItem, handleDeleteLastItem]);

  const handleResetList = () => {
    setItems([]);
  };

  return (
    <div>
      <h1>Checklist</h1>
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Add a new item"
        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
      />
      <button onClick={handleAddItem} style={{ marginRight: '10px' }}>Add</button>
      <button onClick={handleResetList}>Reset List</button>
      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              padding: (editIndex === index || noteIndex === index) ? '20px' : '10px',
              border: '1px solid #00aaff',
              marginBottom: '10px',
              width: '100%',
              transition: 'all 0.3s ease', // Add transition for smooth border expansion
              maxHeight: (editIndex === index || noteIndex === index || item.showNote) ? '200px' : '60px', // Temporarily expand border
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleCheckItem(index)}
              />
              {editIndex === index ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ flexGrow: 1 }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                />
              ) : (
                <span
                  style={{
                    textDecoration: item.checked ? 'line-through' : 'none',
                    flexGrow: 1,
                  }}
                  onClick={() => handleItemClick(index)}
                >
                  {item.text}
                </span>
              )}
              {item.note && <span style={{ marginLeft: '10px', color: '#00aaff' }}>●</span>}
              <button onClick={() => handleDeleteItem(index)}>Delete</button>
              {editIndex === index ? (
                <button onClick={() => handleSaveEdit()}>Save</button>
              ) : (
                <button onClick={() => handleEditItem(index)}>Edit</button>
              )}
              {noteIndex !== index && (
                <button onClick={() => handleAddNote(index)}>{item.note ? 'Edit Note' : 'Add Note'}</button>
              )}
            </div>
            {noteIndex === index && (
              <div className="note-input-container">
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Type your note here..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveNote()}
                />
                <button onClick={handleSaveNote}>Save Note</button>
              </div>
            )}
            {(item.showNote && noteIndex !== index) && (
              <div
                style={{
                  marginTop: '10px',
                  color: '#00aaff',
                  width: 'calc(100% - 20px)',
                  textAlign: 'left',
                  paddingLeft: '20px',
                }}
              >
                {item.note}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Checklist;