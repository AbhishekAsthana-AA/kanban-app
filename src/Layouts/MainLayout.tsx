import { Helmet } from "react-helmet";
import { ReactNode } from "react";
import Header from "../Components/UserInterface/Header";

interface MainLayoutProps {
  children?: ReactNode; // Define the type for children prop
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <Helmet>
        <title>My React App</title>
        <meta name="description" content="This is my amazing React app!" />
        <meta name="keywords" content="React, Web Development, JavaScript" />
        <meta name="author" content="Your Name" />
      </Helmet>
      <Header />
      <main>{children}</main>

      {/* <footer>
        <p>&copy; 2025 My React App. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default MainLayout;
