import { render, screen, fireEvent } from '@testing-library/react';
import ItemCard, { ItemCardInfo } from "../components/ItemCard";



test('renders "?" when closed', () => {
    render(<ItemCard id="1" value="A" src={null} />);
    expect(screen.getByText('?')).toBeInTheDocument();
});

test('shows value when open', () => {
    render(<ItemCard id="1" value="A" src={null} initialOpen />);
    expect(screen.getByText('A')).toBeInTheDocument();
});

test('calls onClick with correct info', () => {
    const handleClick = jest.fn();
    render(<ItemCard id="1" value="A" src={null} onClick={handleClick} />);
    fireEvent.click(screen.getByText('?'));
    expect(handleClick).toHaveBeenCalled();
});