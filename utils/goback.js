export const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/Home";
    }
  };