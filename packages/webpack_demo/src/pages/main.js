import './index.css';
import { formatter } from '@common/date';

console.log('hahaha hehe', formatter(new Date()));

let div = document.createElement('div');
div.innerHTML = 'hello world kdfjafj';

document.body.append(div);

setTimeout(() => {
    import('UILib.common').then(() => {
        import('UILib.button').then(( ret ) => {
            console.log('load button ready', ret);
        });
        // import('UILib.button').then(( ret ) => {
        //     console.log('load button ready', ret);
        // });
    
        // setTimeout(() => {
        //     import('UILib.form').then(( ret ) => {
        //         console.log('load form ready', ret);
        //     });
        // }, 1000);

        // setTimeout(() => {
        //     import('UILib.alert').then(( ret ) => {
        //         console.log('load alert ready', ret);
        //     });
        // }, 1000);
    })
}, 1000);

