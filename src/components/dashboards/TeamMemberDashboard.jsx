import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/apiClient';
import Header from '../layout/Header';
import { Button, Card, Input, Modal, Badge } from '../common';

const TeamMemberDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedContact, setSelectedContact] = useState(null);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksResponse, contactsResponse] = await Promise.all([
        apiClient.get('/tasks'),
        apiClient.get('/contacts')
      ]);
      
      setTasks(tasksResponse.data);
      setContacts(contactsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await apiClient.put(`/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating task:', error);
      if (error.response?.status === 403) {
        alert('Cannot update completed tasks');
      }
    }
  };

  const parseNote = (noteString) => {
    // Parse notes in format: "[timestamp] author: content"
    const match = noteString.match(/^\[(.*?)\]\s+(.*?):\s+(.*)$/);
    if (match) {
      return {
        timestamp: match[1],
        author: match[2],
        content: match[3]
      };
    }
    // Fallback for notes that don't match the expected format
    return {
      timestamp: new Date().toISOString(),
      author: 'Unknown',
      content: noteString
    };
  };

  const addNoteToContact = async (contactId) => {
    if (!newNote.trim()) return;
    
    try {
      console.log('Adding note to contact:', contactId, { note: newNote });
      await apiClient.post(`/contacts/${contactId}/notes`, { note: newNote });
      setNewNote('');
      fetchData();
      // Update selected contact to show new note
      const updatedContact = await apiClient.get(`/contacts/${contactId}`);
      setSelectedContact(updatedContact.data);
      console.log('Note added successfully');
    } catch (error) {
      console.error('Error adding note:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to add note: ${error.response?.data?.detail || error.message}`);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'secondary',
      in_progress: 'warning',
      completed: 'success'
    };
    const labels = {
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed'
    };
    return <Badge variant={variants[status]} size="sm">{labels[status]}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'danger'
    };
    return <Badge variant={variants[priority]} size="sm">{priority}</Badge>;
  };

  // Stats calculations
  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.status === 'completed').length,
    totalContacts: contacts.length,
    pendingTasks: tasks.filter(task => task.status === 'pending').length,
    inProgressTasks: tasks.filter(task => task.status === 'in_progress').length
  };

  const tabs = [
    { id: 'tasks', name: 'My Tasks', icon: '✓' },
    { id: 'contacts', name: 'Contacts', icon: '📋' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <motion.div
            className="flex flex-col items-center space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your work dashboard for today.
          </p>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" hover>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl">
                📝
              </div>
              <div className="ml-4">
                <p className="text-blue-600 text-sm font-medium">Total Tasks</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalTasks}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200" hover>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl">
                ✓
              </div>
              <div className="ml-4">
                <p className="text-green-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-900">{stats.completedTasks}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200" hover>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white text-xl">
                ⏳
              </div>
              <div className="ml-4">
                <p className="text-amber-600 text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-amber-900">{stats.inProgressTasks}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" hover>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl">
                📋
              </div>
              <div className="ml-4">
                <p className="text-purple-600 text-sm font-medium">Contacts</p>
                <p className="text-2xl font-bold text-purple-900">{stats.totalContacts}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tab navigation */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="border-b border-gray-200 bg-white rounded-t-2xl">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </motion.button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'tasks' && (
              <Card padding="lg">
                <Card.Header>
                  <Card.Title>My Tasks</Card.Title>
                  <Card.Description>Manage your assigned tasks</Card.Description>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    {tasks.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📝</span>
                        </div>
                        <p className="text-gray-500 font-medium">No tasks assigned yet</p>
                        <p className="text-gray-400 text-sm">Tasks will appear here when assigned by your founder</p>
                      </div>
                    ) : (
                      tasks.map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                              <p className="text-gray-600 mb-3">{task.description}</p>
                              <div className="flex items-center space-x-4 mb-4">
                                {getPriorityBadge(task.priority)}
                                {getStatusBadge(task.status)}
                                {task.due_date && (
                                  <span className="text-sm text-gray-500">
                                    Due: {new Date(task.due_date).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              {task.status !== 'completed' && (
                                <div className="flex space-x-2">
                                  {task.status === 'pending' && (
                                    <Button
                                      size="sm"
                                      variant="warning"
                                      onClick={() => updateTaskStatus(task.id, 'in_progress')}
                                    >
                                      Start Task
                                    </Button>
                                  )}
                                  {task.status === 'in_progress' && (
                                    <Button
                                      size="sm"
                                      variant="success"
                                      onClick={() => updateTaskStatus(task.id, 'completed')}
                                    >
                                      Mark Complete
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </Card.Body>
              </Card>
            )}

            {activeTab === 'contacts' && (
              <Card padding="lg">
                <Card.Header>
                  <Card.Title>Contacts</Card.Title>
                  <Card.Description>View and manage business contacts</Card.Description>
                </Card.Header>
                <Card.Body>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contacts.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📋</span>
                        </div>
                        <p className="text-gray-500 font-medium">No contacts available</p>
                        <p className="text-gray-400 text-sm">Contacts will appear here when added</p>
                      </div>
                    ) : (
                      contacts.map((contact) => (
                        <motion.div
                          key={contact.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => setSelectedContact(contact)}
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                              <p className="text-sm text-gray-600">{contact.position}</p>
                              <p className="text-sm text-gray-500">{contact.company}</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            {contact.email && (
                              <p className="text-gray-600">📧 {contact.email}</p>
                            )}
                            {contact.phone && (
                              <p className="text-gray-600">📞 {contact.phone}</p>
                            )}
                          </div>
                          <div className="mt-4">
                            <Button size="sm" variant="secondary" className="w-full">
                              View Details
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </Card.Body>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Contact Details Modal */}
      <Modal
        isOpen={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        title="Contact Details"
        size="lg"
      >
        {selectedContact && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                {selectedContact.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedContact.name}</h3>
                <p className="text-gray-600">{selectedContact.position}</p>
                <p className="text-gray-500">{selectedContact.company}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {selectedContact.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedContact.email}</p>
                </div>
              )}
              {selectedContact.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{selectedContact.phone}</p>
                </div>
              )}
            </div>

            {/* Notes section */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Notes</h4>
              {selectedContact.notes && selectedContact.notes.length > 0 ? (
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {selectedContact.notes.map((noteString, index) => {
                    const note = parseNote(noteString);
                    return (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-900">{note.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          By {note.author} on {new Date(note.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No notes available</p>
              )}
              
              <div className="mt-4 flex space-x-2">
                <Input
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newNote.trim()) {
                      addNoteToContact(selectedContact.id);
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={() => addNoteToContact(selectedContact.id)}
                  variant="primary"
                  disabled={!newNote.trim()}
                >
                  Add Note
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TeamMemberDashboard;