import React, { useState, useEffect } from 'react';

function Checklist() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [noteIndex, setNoteIndex] = useState(null);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        if (noteIndex !== null) {
          handleSaveNote();
        } else if (editIndex !== null) {
          handleSaveEdit();
        } else {
          handleAddItem();
        }
      } else if (event.key === 'Delete') {
        handleDeleteLastItem();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [noteIndex, editIndex, items, newItem, noteText, editText]);

  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      setItems([...items, { text: newItem, checked: false, note: '', showNote: false }]);
      setNewItem('');
    }
  };

  const handleResetList = () => {
    setItems([]);
  };

  const handleDeleteLastItem = () => {
    setItems(items.slice(0, -1));
  };

  const handleCheckItem = (index) => {
    const newItems = items.map((item, i) => {
      if (i === index) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    setItems(newItems);
  };

  const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleEditItem = (index) => {
    setEditIndex(index);
    setEditText(items[index].text);
  };

  const handleSaveEdit = () => {
    const newItems = items.map((item, i) => {
      if (i === editIndex) {
        return { ...item, text: editText };
      }
      return item;
    });
    setItems(newItems);
    setEditIndex(null);
    setEditText('');
  };

  const handleAddNote = (index) => {
    setNoteIndex(index);
    setNoteText(items[index].note);
  };

  const handleSaveNote = () => {
    const newItems = items.map((item, i) => {
      if (i === noteIndex) {
        return { ...item, note: noteText };
      }
      return item;
    });
    setItems(newItems);
    setNoteIndex(null);
    setNoteText('');
  };

  const handleItemClick = (index) => {
    const newItems = items.map((item, i) => {
      if (i === index) {
        return { ...item, showNote: !item.showNote };
      }
      return item;
    });
    setItems(newItems);
  };

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('checklistItems'));
    if (savedItems) {
      setItems(savedItems);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('checklistItems', JSON.stringify(items));
  }, [items]);

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