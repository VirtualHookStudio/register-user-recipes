const messagesToasts = {
    defaultSuccess(e, message) {
        e.$toast.success(
            message,
            {
                position:"top-right",
                duration: 4000
            }
        );
    },
    defaultError(e, message) {
        e.$toast.error(
            message,
            {
                position:"top-right",
                duration: 4000
            }
        );
    },
}

export default messagesToasts