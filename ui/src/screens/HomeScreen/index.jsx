import Loadable from 'react-loadable';
const Loading = () => `DAMN< FUck, I'm loading`;

export default Loadable({
    loader: () => import(/* webpackChunkName: "HomeScreen" */'./HomeScreen'),
    loading: Loading,
})