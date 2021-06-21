export function queryFunimation(showTitle, funimationInstance, handleResponse) {
  let qs = {unique: true, limit: 5, q: showTitle, offset: 0 };
  let res = funimationInstance
    .get('source/funimation/search/auto', {params: qs})
    .then((response) => {
      console.log('funimation', response);
      handleResponse(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function queryCrunchyroll(showTitle, crunchyrollInstance, handleResponse, session_id) {
  let filter = `prefix:${showTitle.trim()}`;
  let res = crunchyrollInstance
    .get('list_series.0.json', {params: {media_type: 'anime', session_id: session_id, filter}})
    .then((response) => {
      // console.log('crunchyroll', response);
      handleResponse(response);
    })
    .catch((error) => {
      console.log(error);
    });
}