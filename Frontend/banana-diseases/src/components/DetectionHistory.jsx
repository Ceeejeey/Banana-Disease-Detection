import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const DetectionHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get("/api/detection-history?user_id=1"); // replace with real user logic
                setHistory(response.data);
            } catch (error) {
                console.error("Failed to load history", error);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="text-white">
            <h2 className="text-2xl font-bold mb-6">📜 Detection History</h2>

            {history.length === 0 ? (
                <p className="text-gray-400">No detection history yet...</p>
            ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {history.map((item) => (
                        <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg hover:shadow-green-600/30 transition">
                            <img
                                src={`http://localhost:8000/api/images/${item.image_path}`}
                                alt="Detected Banana"
                                className="w-full h-48 object-cover rounded-md mb-4 border border-gray-600"
                            />
                            <div className="space-y-1">
                                <p><strong className="text-green-400">Disease:</strong> {item.disease || 'N/A'}</p>
                                <p><strong className="text-green-400">Solution:</strong> {item.solution || 'N/A'}</p>
                                <p><strong className="text-green-400">Confidence:</strong> {item.confidence || 'N/A'}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                    🕒 Detected on: {new Date(item.created_at).toLocaleString('en-US', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DetectionHistory;
