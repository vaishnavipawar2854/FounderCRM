import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/apiClient';
import Header from '../layout/Header';
import { Button, Card, Input, Modal, Badge } from '../common';

const FounderDashboard = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Modal states
  const [showAddTeamMember, setShowAddTeamMember] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showEditTeamMember, setShowEditTeamMember] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [showEditContact, setShowEditContact] = useState(false);

  const [credentials, setCredentials] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [teamMemberForm, setTeamMemberForm] = useState({
    name: '',
    email: ''
  });
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assigned_to: '',
    priority: 'medium',
    due_date: ''
  });
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamResponse, tasksResponse, contactsResponse] = await Promise.all([
        apiClient.get('/users/team'),
        apiClient.get('/tasks'),
        apiClient.get('/contacts')
      ]);
      
      setTeamMembers(teamResponse.data);
      setTasks(tasksResponse.data);
      setContacts(contactsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Stats calculations
  const stats = {
    totalTeamMembers: teamMembers.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.status === 'completed').length,
    totalContacts: contacts.length,
    pendingTasks: tasks.filter(task => task.status === 'pending').length,
    inProgressTasks: tasks.filter(task => task.status === 'in_progress').length
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'team', name: 'Team', icon: '👥' },
    { id: 'tasks', name: 'Tasks', icon: '✓' },
    { id: 'contacts', name: 'Contacts', icon: '📋' },
  ];

  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/auth/create-team-member', teamMemberForm);
      setCredentials(response.data);
      setTeamMemberForm({ name: '', email: '' });
      setShowAddTeamMember(false);
      fetchData();
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/tasks', {
        ...taskForm,
        due_date: taskForm.due_date || null
      });
      setTaskForm({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'medium',
        due_date: ''
      });
      setShowAddTask(false);
      fetchData();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/contacts', contactForm);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: ''
      });
      setShowAddContact(false);
      fetchData();
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      low: 'success',
      medium: 'warning', 
      high: 'danger'
    };
    return <Badge variant={variants[priority]} size="sm">{priority}</Badge>;
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
            Here's what's happening with your startup today.
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
                👥
              </div>
              <div className="ml-4">
                <p className="text-blue-600 text-sm font-medium">Team Members</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalTeamMembers}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200" hover>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl">
                ✓
              </div>
              <div className="ml-4">
                <p className="text-green-600 text-sm font-medium">Completed Tasks</p>
                <p className="text-2xl font-bold text-green-900">{stats.completedTasks}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" hover>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl">
                📋
              </div>
              <div className="ml-4">
                <p className="text-purple-600 text-sm font-medium">Total Contacts</p>
                <p className="text-2xl font-bold text-purple-900">{stats.totalContacts}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200" hover>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white text-xl">
                ⏳
              </div>
              <div className="ml-4">
                <p className="text-amber-600 text-sm font-medium">Pending Tasks</p>
                <p className="text-2xl font-bold text-amber-900">{stats.pendingTasks}</p>
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
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent tasks */}
                <Card padding="lg" hover>
                  <Card.Header>
                    <Card.Title>Recent Tasks</Card.Title>
                    <Card.Description>Your latest task updates</Card.Description>
                  </Card.Header>
                  <Card.Body>
                    <div className="space-y-4">
                      {tasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-900">{task.title}</p>
                            <p className="text-sm text-gray-600">{task.description}</p>
                          </div>
                          {getStatusBadge(task.status)}
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>

                {/* Recent team activity */}
                <Card padding="lg" hover>
                  <Card.Header>
                    <Card.Title>Team Activity</Card.Title>
                    <Card.Description>Latest team member updates</Card.Description>
                  </Card.Header>
                  <Card.Body>
                    <div className="space-y-4">
                      {teamMembers.slice(0, 3).map((member) => (
                        <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )}

            {activeTab === 'team' && (
              <Card padding="lg">
                <Card.Header className="flex justify-between items-center">
                  <div>
                    <Card.Title>Team Members</Card.Title>
                    <Card.Description>Manage your startup team</Card.Description>
                  </div>
                  <Button
                    onClick={() => setShowAddTeamMember(true)}
                    variant="primary"
                    icon={<span>+</span>}
                  >
                    Add Team Member
                  </Button>
                </Card.Header>
                <Card.Body>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.map((member) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.email}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Button size="sm" variant="secondary">
                            Edit
                          </Button>
                          <Button size="sm" variant="danger">
                            Delete
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}

            {activeTab === 'tasks' && (
              <Card padding="lg">
                <Card.Header className="flex justify-between items-center">
                  <div>
                    <Card.Title>Tasks</Card.Title>
                    <Card.Description>Manage project tasks and assignments</Card.Description>
                  </div>
                  <Button
                    onClick={() => setShowAddTask(true)}
                    variant="success"
                    icon={<span>+</span>}
                  >
                    Add Task
                  </Button>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    {tasks.map((task) => (
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
                            <div className="flex items-center space-x-4">
                              {getPriorityBadge(task.priority)}
                              {getStatusBadge(task.status)}
                              {task.due_date && (
                                <span className="text-sm text-gray-500">
                                  Due: {new Date(task.due_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button size="sm" variant="secondary">
                              Edit
                            </Button>
                            <Button size="sm" variant="danger">
                              Delete
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}

            {activeTab === 'contacts' && (
              <Card padding="lg">
                <Card.Header className="flex justify-between items-center">
                  <div>
                    <Card.Title>Contacts</Card.Title>
                    <Card.Description>Manage your business contacts and leads</Card.Description>
                  </div>
                  <Button
                    onClick={() => setShowAddContact(true)}
                    variant="purple"
                    icon={<span>+</span>}
                  >
                    Add Contact
                  </Button>
                </Card.Header>
                <Card.Body>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contacts.map((contact) => (
                      <motion.div
                        key={contact.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
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
                        <div className="mt-4 flex space-x-2">
                          <Button size="sm" variant="secondary">
                            Edit
                          </Button>
                          <Button size="sm" variant="danger">
                            Delete
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showAddTeamMember}
        onClose={() => setShowAddTeamMember(false)}
        title="Add Team Member"
      >
        <form onSubmit={handleAddTeamMember} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={teamMemberForm.name}
            onChange={(e) => setTeamMemberForm({...teamMemberForm, name: e.target.value})}
            required
            placeholder="Enter team member's name"
          />
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={teamMemberForm.email}
            onChange={(e) => setTeamMemberForm({...teamMemberForm, email: e.target.value})}
            required
            placeholder="Enter email address"
          />
          <div className="flex space-x-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              Add Team Member
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowAddTeamMember(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        title="Add New Task"
        size="lg"
      >
        <form onSubmit={handleAddTask} className="space-y-4">
          <Input
            label="Task Title"
            name="title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
            required
            placeholder="Enter task title"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={taskForm.description}
              onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
              rows={3}
              className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter task description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                name="priority"
                value={taskForm.priority}
                onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <Input
              label="Due Date"
              type="date"
              name="due_date"
              value={taskForm.due_date}
              onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <Button type="submit" variant="success" className="flex-1">
              Add Task
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowAddTask(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showAddContact}
        onClose={() => setShowAddContact(false)}
        title="Add New Contact"
        size="lg"
      >
        <form onSubmit={handleAddContact} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={contactForm.name}
            onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
            required
            placeholder="Enter contact's name"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
              placeholder="Enter email address"
            />
            <Input
              label="Phone Number"
              name="phone"
              value={contactForm.phone}
              onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
              placeholder="Enter phone number"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company"
              name="company"
              value={contactForm.company}
              onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
              placeholder="Enter company name"
            />
            <Input
              label="Position"
              name="position"
              value={contactForm.position}
              onChange={(e) => setContactForm({...contactForm, position: e.target.value})}
              placeholder="Enter job position"
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              Add Contact
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowAddContact(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FounderDashboard;