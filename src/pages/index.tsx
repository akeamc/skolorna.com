import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div>
      <h1>Skolorna</h1>
      <style jsx>{`
        h1 {
          font-size: 20vw;
          font-weight: 700;
          letter-spacing: -0.022em;
          user-select: none;
        }

        div {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
      <style global jsx>{`
        body {
          background: black;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Home;
