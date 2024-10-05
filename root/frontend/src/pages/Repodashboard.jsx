import React, { useState, useEffect } from 'react';


const Repodashboard = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [commitInfo, setCommitInfo] = useState(null); // Holds fetched commit information
    const [loading, setLoading] = useState(false); // Loading state for commit info
    const [error, setError] = useState(null); // Error state for fetch operations

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/projects');
                const data = await response.json();
                setProjects(data);
                setSelectedProject(data[0]); // Set the first project as default
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

   useEffect(() => {
        const fetchCommitInfo = async () => {
            if (!selectedProject || !selectedProject.repoUrl) return; // Check if there's a selected project and if it has a repoUrl

            setLoading(true); // Set loading to true before the fetch
            setError(null); // Reset error state before fetching

            try {
                const response = await fetch(`http://localhost:5000/api/commit-info?repoUrl=${encodeURIComponent(selectedProject.repoUrl)}`);
                const data = await response.json();
                setCommitInfo(data); // Store fetched commit information
            } catch (error) {
                console.error('Error fetching commit info:', error);
                setError('Failed to fetch commit information');
            } finally {
                setLoading(false); // Set loading to false after the fetch is complete
            }
        };

        fetchCommitInfo();
    }, [selectedProject]); // Fetch commit info whenever selectedProject changes



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
                        src={selectedProject.avatarUrl}
                        alt={`${selectedProject.projectName} avatar`}
                        className="w-16 h-16 rounded-full object-cover border-4 border-gray-300 shadow-lg"
                    />
                )}
            </div>

            <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">{selectedProject.projectName}</h2>
                <p className="text-gray-600 mb-4">{selectedProject.projectDetails}</p>

                {/* Sample Image */}
                <img
                    src="https://via.placeholder.com/150" // Sample Image URL
                    alt="Project Thumbnail"
                    className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover mt-2" // Adjust size and styles
                />

                {/* Commit Info Display */}
                {loading ? (
                    <p className="text-gray-600">Loading commit information...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 mt-6">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900">Committer Name</h3>
                            <p className="text-sm font-light text-gray-900">{commitInfo && commitInfo.authorInfo.length > 0 ? commitInfo.authorInfo[0].committerName : "Unknown"}</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900">Number of Commits</h3>
                            <p className="text-sm font-light text-gray-900">{commitInfo ? commitInfo.commitCount : 0}</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900">Email of Author</h3>
                            <p className="text-sm font-light text-gray-900">{commitInfo && commitInfo.authorInfo.length > 0 ? commitInfo.authorInfo[0].authorEmail : "No email available"}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900">Date Created</h3>
                            <p className="text-sm font-light text-gray-900">{commitInfo && commitInfo.authorInfo.length > 0 ? commitInfo.authorInfo[0].createdDate : "N/A"}</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900">Organizations</h3>
                            <p className="text-sm font-light text-gray-900">{commitInfo && commitInfo.authorInfo.length > 0 ? commitInfo.authorInfo[0].organizations : "N/A"}</p>
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
