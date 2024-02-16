import Image from "next/image";
import Logo from "../../public/logo.svg";

const AuthNav = () => {
    return (
        <nav className="flex items-center border-b h-16 px-4">
            <Image src={Logo} height={42} alt="logo" />
        </nav>
    )
}

export { AuthNav };