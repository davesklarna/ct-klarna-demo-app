import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h2>Home</h2>
      <div>
        <Link to="/products">View all products</Link>
      </div>
    </div>
  );
};

export default Home;
