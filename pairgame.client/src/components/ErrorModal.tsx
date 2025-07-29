type Props = {
    message: string;
    onClose: () => void;
};

function ErrorModal({ message, onClose }: Props) {
    return (
        <div className= "modal show d-block" tabIndex = {- 1
}>
    <div className="modal-dialog" >
        <div className="modal-content" >
            <div className="modal-header" >
                <h5 className="modal-title" > Error </h5>
                    < button type = "button" className = "btn-close" onClick = { onClose } > </button>
                        </div>
                        < div className = "modal-body" >
                            <p>{ message } </p>
                            </div>
                            < div className = "modal-footer" >
                                <button className="btn btn-secondary" onClick = { onClose } > Close </button>
                                    </div>
                                    </div>
                                    </div>
                                    </div>
    );
}

export default ErrorModal;