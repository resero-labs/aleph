import Loadable from 'react-loadable';
const Loading = () => `DAMN< FUck, I'm loading`;

export default Loadable({
    loader: () => import(/* webpackChunkName: "EntitySimilarScreen" */'./EntitySimilarScreen'),
    loading: Loading,
})