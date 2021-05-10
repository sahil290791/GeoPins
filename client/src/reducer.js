export default function reducer(state, { payload, type }) {
    switch(type) {
        case "LOGIN_USER":
            return {
                ...state,
                currentUser: payload
            };
        case "IS_LOGGED_IN":
            return {
                ...state,
                isAuth: payload,
            }
        case "SIGNOUT_USER":
            return {
                ...state,
                isAuth: false,
                currentUser: null
            }
        case "CREATE_DRAFT":
            return {
                ...state,
                currentPin: null,
                draft: {
                    latitude: 0,
                    longitude: 0
                }
            };
        case "UPDATE_DRAFT_LOCATION":
            return {
                ...state,
                draft: payload,
                currentPin: null,
            };
        case "DELETE_DRAFT":
            return {
                ...state,
                draft: null
            };
        case "SET_PINS":
            return {
                ...state,
                pins: payload
            };
        case "CREATE_PIN": {
            const newPin = payload;
            const prevPins = state.pins.filter(pin => pin._id !== newPin._id);
            return {
                ...state,
                pins: [
                    ...prevPins,
                    newPin
                ]
            };
        }
        case "SET_PIN":
            return {
                ...state,
                draft: null,
                currentPin: payload
            };
        case "DELETE_PIN": {
            const deletedPin = payload;
            const prevPins = state.pins.filter(pin => pin._id !== deletedPin._id);
            if (state.currentPin) {
                const isCurrentPin = deletedPin._id === state.currentPin._id;
                if (isCurrentPin) {
                    return {
                        ...state,
                        pins: prevPins,
                        currentPin: null
                    };
                }

            }
            return {
                ...state,
                pins: prevPins
            };
        }
        case "CREATE_COMMENT": {
            const updatedPin = payload;
            const updatedPins = state.pins.map(pin => pin._id === updatedPin._id ? updatedPin : pin);
            if (state.currentPin) {
                const isCurrentPin = updatedPin._id === state.currentPin._id;
                if (isCurrentPin) {
                    return {
                        ...state,
                        pins: [
                            ...updatedPins,
                        ],
                        currentPin: updatedPin
                    };
                }

            } else {
                
            }
            return {
                ...state,
                pins: [
                    ...updatedPins,
                ],
            }
        }
        default:
            return state;
    }
};