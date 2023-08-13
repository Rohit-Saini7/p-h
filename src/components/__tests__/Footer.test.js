import Footer from "../Footer";
import { render } from "@testing-library/react";

test("testing footer", () => {
  const footer = render(<Footer />);
  const heading = footer.getByTestId("footer");
  expect(heading.innerHTML).toBe("© 2023 made by Chinmay 🎉");
});
