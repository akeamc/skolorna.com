import React, { FunctionComponent } from "react";
import Container from "../layout/Container";
import { Recent } from "./Recent";
import { Search } from "./Search";

export const Discover: FunctionComponent = () => (
  <section>
    <Container>
      <div className="container">
        <aside>
          <Recent />
        </aside>
        <main>
          <Search />
        </main>
        <style jsx>{`
          .container {
            display: grid;
            grid-template-columns: 1fr;
            gap: 32px;
            margin-block: 32px;
          }

          @media (min-width: 768px) {
            .container {
              grid-template-columns: 300px 1fr;
            }
          }

          aside,
          main {
            width: 100%;
            min-width: 0;
          }
        `}</style>
      </div>
    </Container>
  </section>
);
