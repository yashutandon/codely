import {Navbar} from "@/modules/home/ui/components/nav-bar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex flex-col min-h-screen max-h-screen">
    <Navbar/>
<div
  className="fixed top-0 left-0 w-full min-h-screen -z-10 
    bg-gradient-to-br from-white via-purple-100 to-blue-100 
    dark:from-[#0f0c29] dark:via-[#302b63] dark:to-[#24243e]
    bg-no-repeat bg-fixed
    after:content-[''] after:absolute after:inset-0 after:z-[-1]
    after:bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_30%)]
    dark:after:bg-[radial-gradient(circle_at_30%_30%,rgba(255,0,255,0.08),transparent_40%)]
    backdrop-blur-md"
/>




      <div className="flex-1 flex flex-col px-4 pb-4">{children}</div>
    </main>
  );
};

export default Layout;
