import { useReducer, useCallback } from "react";

const initialState = {
  loading: false, 
  errorMessage: null,
  action: null,
  data: null,
  extra: null
};

const httpReducer = (httpState, action) => {
    switch (action.type){
      case 'SEND': return {loading: true, errorMessage: null };
      case 'RESPONSE': return {loading: false, errorMessage: null, data: action.data, action: action.action, extra: action.extra};
      case 'ERROR': return {loading: false, errorMessage: action.errorMessage};
      case 'CLEAR_ERROR': return {...initialState};
      
      default: throw new Error('Should not be reached!')
    }
  };

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, {
      ...initialState
        });

    let http = httpState;
    let errorMessage = 'Something went wrong!';

    const clearError = useCallback( () => {
      dispatchHttp({type: "CLEAR_ERROR"})
    }, []);

    const sendRequest = useCallback( (url, method, body, extra) => {
        dispatchHttp({type: "SEND"});
        fetch( url, {
            method,
            body,
            headers : {
                'Content-Type': 'application/json'
            }
          }).then(response => {
              return response.json();
          }).then(resData => {
            dispatchHttp({type: 'RESPONSE', data: resData, action: method, extra});
          }).catch(error => {
            dispatchHttp({type: 'ERROR', errorMessage});
          });

    }, [errorMessage]);

    return {
        loading : http.loading,
        error : http.errorMessage,
        sendRequest,
        clearError,
        action: http.action,
        extra: http.extra,
        data: http.data
    };
};

    
export default useHttp;