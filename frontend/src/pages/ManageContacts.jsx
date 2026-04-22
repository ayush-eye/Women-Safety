import { useState, useEffect } from "react";
import { User, Phone, Plus, Trash2, Save, ArrowLeft, Shield, Heart } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import AuthService from "../services/auth.service";

const ManageContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const user = AuthService.getCurrentUser();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/me`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setContacts(response.data.user.emergency_contacts || []);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setFetching(false);
            }
        };
        fetchProfile();
    }, [user.token]);

    const handleAddContact = () => {
        if (contacts.length >= 5) {
            setMessage({ type: "error", text: "Maximum 5 emergency contacts allowed." });
            return;
        }
        setContacts([...contacts, { name: "", contact: "" }]);
    };

    const handleRemoveContact = (index) => {
        setContacts(contacts.filter((_, i) => i !== index));
    };

    const handleInputChange = (index, field, value) => {
        const newContacts = [...contacts];
        newContacts[index][field] = value;
        setContacts(newContacts);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        // Basic validation and formatting
        const formattedContacts = contacts.map(c => {
            let phone = c.contact.replace(/\D/g, "");
            if (phone.length === 10) phone = `+91${phone}`;
            else if (!phone.startsWith("+") && phone.length > 0) phone = `+${phone}`;
            return { ...c, contact: phone };
        });

        if (formattedContacts.some(c => !c.name || c.contact.length < 10)) {
            setMessage({ type: "error", text: "Please provide valid names and 10-digit mobile numbers." });
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/update-contacts`, {
                emergency_contacts: formattedContacts
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setMessage({ type: "success", text: "Contacts updated successfully!" });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: "error", text: "Failed to update contacts. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-pink-50 via-white to-red-50 py-16 px-4">
            <div className="max-w-3xl mx-auto">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold mb-8 transition-colors group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-14 border border-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-red-50 rounded-bl-full opacity-50 -mr-10 -mt-10"></div>
                    
                    <div className="relative z-10 sm:flex justify-between items-end mb-12">
                        <div>
                            <div className="bg-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-red-200">
                                <Heart className="text-white" size={32} />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                                Trusted <span className="text-red-600">Contacts</span>
                            </h2>
                            <p className="text-gray-500 mt-2 text-lg">Your emergency notification circle</p>
                        </div>
                        <button 
                            onClick={handleAddContact}
                            className="mt-6 sm:mt-0 flex items-center gap-2 bg-black text-white px-6 py-4 rounded-2xl font-bold hover:bg-red-600 transition-all hover:scale-105 active:scale-95 shadow-lg"
                        >
                            <Plus size={20} strokeWidth={3} />
                            Add Contact
                        </button>
                    </div>

                    {message && (
                        <div className={`mb-8 p-5 rounded-2xl flex items-center gap-3 font-bold animate-shake ${
                            message.type === "success" ? "bg-green-50 text-green-700 border-l-4 border-green-500" : "bg-red-50 text-red-700 border-l-4 border-red-500"
                        }`}>
                            <Shield size={20} />
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6 relative z-10">
                        {contacts.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 font-bold mb-2">No contacts added yet.</p>
                                <p className="text-sm text-gray-300">Add trusted contacts who should be notified in case of emergency.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {contacts.map((contact, index) => (
                                    <div key={index} className="group flex flex-col md:flex-row gap-4 p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-red-100 hover:bg-white transition-all hover:shadow-xl hover:shadow-red-100/30">
                                        <div className="flex-1 space-y-2">
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Full Name"
                                                    className="w-full pl-12 pr-4 py-4 bg-white md:bg-gray-100/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-red-600 focus:outline-none transition-all font-bold text-gray-800"
                                                    value={contact.name}
                                                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-red-600 transition-colors" size={18} />
                                                <input
                                                    type="tel"
                                                    placeholder="10-digit mobile number"
                                                    className="w-full pl-12 pr-4 py-4 bg-white md:bg-gray-100/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-red-600 focus:outline-none transition-all font-bold text-gray-800"
                                                    value={contact.contact}
                                                    onChange={(e) => handleInputChange(index, "contact", e.target.value)}
                                                    pattern="[0-9]{10}"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveContact(index)}
                                            className="p-4 bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all self-end md:self-center"
                                            title="Remove"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pt-10 flex gap-4">
                            <button
                                type="submit"
                                disabled={loading || contacts.length === 0}
                                className="flex-grow bg-red-600 hover:bg-black text-white font-black py-5 rounded-[2rem] transition-all duration-500 shadow-2xl shadow-red-200 hover:shadow-black/20 flex items-center justify-center gap-3 text-xl disabled:bg-gray-300 disabled:shadow-none"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save size={24} strokeWidth={3} />
                                        Save All Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-12 bg-black rounded-[2rem] p-8 text-white flex items-center gap-6 shadow-2xl">
                    <div className="bg-red-600/20 p-4 rounded-2xl text-red-500">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h4 className="text-xl font-black mb-1">Security Note</h4>
                        <p className="text-gray-400 font-medium">For maximum safety, we recommend adding at least 3 trusted family members or friends who are likely to be available in case of an emergency.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageContacts;
