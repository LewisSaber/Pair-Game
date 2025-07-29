import { useContext, useState } from "react"
import { AuthContext } from "../contexts"
import ProfileTab from "../components/ProfileTabs/ProfileTab";
import IconSetsTab from "../components/ProfileTabs/IconSetsTab";

function Profile() {

    const { user } = useContext(AuthContext)
    const [activeTab, setActiveTab] = useState("profile");


    const userId = new URLSearchParams(window.location.search).get("userid")
    if (!user || userId != user.id) {
        return <h1> Cant view other people profile yet</h1>
    }
    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow p-4">
         
            <div className="flex border-b mb-4">
                {["profile", "iconsets"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 capitalize ${activeTab === tab ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"
                            }`}
                    >
                        {tab === "profile" ? "Profile" : "Icon Sets"}
                    </button>
                ))}
            </div>

     
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "iconsets" && <IconSetsTab />}
        </div>
    );
}

export default Profile