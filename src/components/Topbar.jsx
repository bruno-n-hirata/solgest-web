export default function Topbar({ initials = "BN" }) {
    return (
        <header className="topbar">
            <div></div>
            <div className="user-avatar">{initials}</div>
        </header>
    );
}
