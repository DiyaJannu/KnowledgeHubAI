import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {

    return (

        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <div className="flex">

                <Sidebar />

                <main className="flex-1">

                    <div className="max-w-7xl mx-auto px-16 py-12">

                        {children}

                    </div>

                </main>

            </div>

        </div>

    );

}

export default MainLayout;