export const formatTimeUntil = (dateString) => {
    const now = new Date();
    const expiry = new Date(dateString);
    const diff = expiry - now;
  
    if (diff <= 0) {
      return 'Expired';
    }
  
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
    if (days > 0) {
      return `Expires in ${days}d ${hours}h`;
    } else if (hours > 0) {
      return `Expires in ${hours}h ${minutes}m`;
    } else {
      return `Expires in ${minutes}m`;
    }
};

export const formatDateTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString([], { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
};

export const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
};
