export const formatDate = (date) => {
    if (!date) return ''; // Handle empty dates
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Ensure two digits
    const day = String(d.getDate()).padStart(2, '0'); // Ensure two digits
    return `${year}-${month}-${day}`;
  };
  