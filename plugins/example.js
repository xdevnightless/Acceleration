export default {
    /**
     * Anonomous function that is hooked onto type
     * Behavior:
     * eval - Evaluates the function with `eval()`
     * network - Adds the function as a `fetch` listener, requires the `req` attribute and must return something
     * tag - A `<script>` tag with the anonomous function will be appened to either the head or body of the document
     */
    'code': Function,

    'info': {
        /** 
         * Name displayed to user, can be any string (required)
         */
        'name': String,

        /**
         * Icon displayed to user, must be an external URL if provided (optional)
         * Default fallback icon will be provided if none is provided by creator 
         */
        'icon': String,

        /**
         * Description displayed to user, can be any string (required)
         */
        'description': String,

        /**
         * Determines how the plugin is ran (required)
         * Options:
         * eval - Runs once on page load through `eval(content)`
         * network - Runs on all UV fetch events (requires 'when')
         * tag - `<script>` tag is placed on page (default placement is in the head, modified with 'when')
         */
        'type': String,

        /**
         * Required for network
         * Network Options:
         * before - Runs before request is processed by UV (Modify request)
         * after - Runs after request is processed by UV (Modify response)
         * never - Never run script, can be used to disable scripts (why?)
         * 
         * Optional for tag
         * Tag Options:
         * head - Append script to head of the document
         * body - Append script to body of the document
         * 
         * No effect on eval
         */
        'when': String,

        /**
         * Regular expression to limit what hosts the plugin effects (optional)
         */
        'hosts': RegExp
    }
}