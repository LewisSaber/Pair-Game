
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../pages/Home";
import { BrowserRouter } from "react-router";

const mockedNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockedNavigate,
}));

const mockIconSetsFromServer = [
    { id: 1, name: "ServerSet1", images: Array(10).fill({}) },
    { id: 2, name: "ServerSet2", images: Array(5).fill({}) },
];

beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(mockIconSetsFromServer),
        } as Response)
    ) as jest.Mock;
});

jest.mock("../components/CustomGame", () => (props: any) => (
    <button onClick={() => props.onStart(3, 3)}>CustomGameMock</button> // odd size for error test
));

describe("Home component", () => {
    const renderComponent = () =>
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

    test("renders predefined icon set initially", () => {
        renderComponent();
        expect(screen.getByRole("option", { name: /Alphabet - 33 icons/i })).toBeInTheDocument();
    });

    test("loads icon sets from server and appends to select options", async () => {
        renderComponent();
        await waitFor(() => {
            expect(screen.getByRole("option", { name: /ServerSet1 - 10 icons/i })).toBeInTheDocument();
            expect(screen.getByRole("option", { name: /ServerSet2 - 5 icons/i })).toBeInTheDocument();
        });
    });

    test("shows error if game size is odd when using CustomGame", async () => {
        renderComponent();
        await waitFor(() => screen.getByRole("option", { name: /ServerSet1 - 10 icons/i }));

        fireEvent.click(screen.getByText("CustomGameMock"));

        expect(await screen.findByText(/Game size can't be odd!/i)).toBeInTheDocument();
    });

    test("navigates when game size is valid", async () => {
        renderComponent();
        await waitFor(() => screen.getByRole("option", { name: /Alphabet - 33 icons/i }));

        fireEvent.click(screen.getByRole("button", { name: /Medium \(4x3\)/i }));

        expect(mockedNavigate).toHaveBeenCalledWith(
            expect.stringContaining("width=4&height=3")
        );
    });

    test("shows error if icon set has not enough icons", async () => {
        renderComponent();
        await waitFor(() => screen.getByRole("option", { name: /Alphabet - 33 icons/i }));

 
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "2" } });


        fireEvent.click(screen.getByRole("button", { name: /Big \(6x4\)/i }));

        expect(await screen.findByText(/Icon set has not enough icons/i)).toBeInTheDocument();
        expect(mockedNavigate).not.toHaveBeenCalled();
    });
});
