const openModal = (idModal) => {
    document.getElementById(idModal).style.setProperty("display", "flex", "important");
}
const closeModal = (idModal) => {
    document.getElementById(idModal).style.setProperty("display", "none", "important");
}
export default{
    openModal,
    closeModal,
}