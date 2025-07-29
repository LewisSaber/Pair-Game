import HeaderNavigation from "./HeaderNavigation";
import ProfileNavButton from "./ProfileNavButton";

function AppHeader() {
    return (
        <header className="d-flex justify-content-between align-items-center px-4 py-3 bg-dark text-white shadow-sm">
            <HeaderNavigation />
            <ProfileNavButton />
        </header>
    );
}

export default AppHeader;