const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-10">
            <span className="animate-spin border-4 border-warning border-l-transparent rounded-full w-10 h-10 inline-block"></span>
        </div>
    );
};

export default Loader;
