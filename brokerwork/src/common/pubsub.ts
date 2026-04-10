/**
 * simple version of pubsub
 */

let token = 1000;

class PubSub{
    constructor(){
        this.map = {};
        this.tokenHandlerMap = {};
    }
    ensureHandlers(type){
        var handlers = this.map[type];
        if (handlers == null){
            handlers = [];
            this.map[type] = handlers;
        }
        return handlers;
    }
    subscribe(type, handler){
        this.ensureHandlers(type).push(handler);
        let nextToken = token++;
        this.tokenHandlerMap[nextToken] = handler;
        return nextToken;
    }
    publish(type, args){
        var handlers = this.ensureHandlers(type);
        for (let i=0; i<handlers.length; i++){
            let handler = handlers[i];
            
            handler.apply(this, [args])
        }
    }
    unsubscribe(token){
        let map = this.map;
        var handlerFn = this.tokenHandlerMap[token];
        if (handlerFn != null){
            for (let key in map){
                let handlers = this.ensureHandlers(key);
                handlers = handlers.filter(handler=>{
                    return handler != handlerFn
                })
                this.map[key] = handlers;
                
            }
        }
    }
}

let singleton = new PubSub();

export default singleton;