import React, { useState, useEffect } from 'react';

const Repodashboard = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [commitInfo, setCommitInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/projects');
                const data = await response.json();
                setProjects(data);
                setSelectedProject(data[0]);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (!selectedProject) return;

        setLoading(true);
        setError(null);

        // Hardcoded commit information sets
        const hardcodedCommitInfoSets = [
            {
                commitCount: 142,
                authorInfo: [{
                    committerName: "dasunwickr",
                    authorEmail: "dasunwickramasinghe@gmail.com",
                    createdDate: "2019-05-15",
                    organizations: "Hackers Squad"
                }]
            },
            {
                commitCount: 15,
                authorInfo: [{
                    committerName: "Avindi Obeyesekere",
                    authorEmail: "avindiobeyesekere1@gmail.com",
                    createdDate: "2023-06-20",
                    organizations: "Innobot Health "
                }]
            },
            {
                commitCount: 30,
                authorInfo: [{
                    committerName: "Avindi Obeyesekere",
                    authorEmail: "avindiobeyesekere1@gmail.com",
                    createdDate: "2019-12-08",
                    organizations: "Innobot Health "
                }]
            },
            {
                commitCount: 25,
                authorInfo: [{
                    committerName: "Avindi Obeyesekere",
                    authorEmail: "avindiobeyesekere1@gmail.com",
                    createdDate: "2024-03-18",
                    organizations: "Innobot Health "
                }]
            },
            {
                commitCount: 69,
                authorInfo: [{
                    committerName: "Avindi Obeyesekere",
                    authorEmail: "avindiobeyesekere1@gmail.com",
                    createdDate: "2024-03-18",
                    organizations: "Innobot Health "
                }]
            }
        ];

        // Map projects to the corresponding hardcoded data set
        const projectIndex = projects.indexOf(selectedProject);
        const commitData = hardcodedCommitInfoSets[projectIndex] || null;

        if (commitData) {
            setTimeout(() => {
                setCommitInfo(commitData);
                setLoading(false);
            }, 1000);
        } else {
            setError('No commit information available');
            setLoading(false);
        }
    }, [selectedProject, projects]);

    const filteredProjects = projects.filter(project =>
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-50">
            {/* Left section: Project List */}
            <div className="w-full md:w-1/4 p-4 bg-white shadow-md z-10">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full px-4 py-2 border rounded-md focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    {filteredProjects.map((project) => (
                        <button
                            key={project._id}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${selectedProject && selectedProject._id === project._id ? 'bg-blue-100 text-blue-800 shadow-sm' : 'hover:bg-gray-100'
                                }`}
                            onClick={() => setSelectedProject(project)}
                        >
                            <span className="font-medium">{project.projectName}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right section: Project Details */}
            <div className="w-full md:w-3/4 p-4 md:p-8 overflow-auto bg-gray-50 relative">
                {selectedProject ? (
                    <div className="bg-white p-6 rounded-lg shadow-lg relative flex items-start">
                        {/* Avatar Image on the left */}
                        <div className="mr-4">
                            {selectedProject.avatarUrl && (
                                <img
                                    src={`/path/to/local/images/${selectedProject._id}.png`} // Local image path
                                    alt={`${selectedProject.projectName} avatar`}
                                    className="w-16 h-16 rounded-full object-cover border-4 border-gray-300 shadow-lg"
                                />
                            )}
                        </div>

                        <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">{selectedProject.projectName}</h2>
                            <p className="text-gray-600 mb-4">{selectedProject.projectDetails}</p>

                            {loading ? (
                                <p className="text-gray-600">Loading commit information...</p>
                            ) : error ? (
                                <p className="text-red-600">{error}</p>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 mt-6">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900">Committer Name</h3>
                                        <p className="text-sm font-light text-gray-900">{commitInfo?.authorInfo[0].committerName}</p>
                                    </div>
                                    <div className="p-4 bg-yellow-50 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900">Number of Commits</h3>
                                        <p className="text-sm font-light text-gray-900">{commitInfo?.commitCount}</p>
                                    </div>
                                    <div className="p-4 bg-red-50 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900">Email of Author</h3>
                                        <p className="text-sm font-light text-gray-900">{commitInfo?.authorInfo[0].authorEmail}</p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900">Date Created</h3>
                                        <p className="text-sm font-light text-gray-900">{commitInfo?.authorInfo[0].createdDate}</p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900">Organizations</h3>
                                        <p className="text-sm font-light text-gray-900">{commitInfo?.authorInfo[0].organizations}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-600">Select a project to view its details.</div>
                )}
            </div>
        </div>
    );
};

export default Repodashboard;
