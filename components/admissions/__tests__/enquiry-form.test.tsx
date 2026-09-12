import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnquiryForm } from '../enquiry-form';

describe('EnquiryForm', () => {
    const mockOnClose = jest.fn();

    it('renders step 1 form fields correctly', () => {
        render(<EnquiryForm onClose={mockOnClose} />);

        expect(screen.getByText('New Enquiry')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument();
        expect(screen.getByText('Student Name')).toBeInTheDocument();
    });

    it('navigates to step 2 when clicking Next', () => {
        render(<EnquiryForm onClose={mockOnClose} />);

        const nextButton = screen.getByText('Next: Application Form');
        fireEvent.click(nextButton);

        expect(screen.getByText('Admission Application')).toBeInTheDocument();
        expect(screen.getByText('Date of Birth')).toBeInTheDocument();
    });

    it('calls onClose when clicking Cancel', () => {
        render(<EnquiryForm onClose={mockOnClose} />);

        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalled();
    });
});
