
interface ElectronAPI {
    start_service: (name: string) => Promise<any>,
    stop_service: (name: string) => Promise<any>,
    get_services: () => Promise<any>,
    get_status: () => Promise<any>,
    save_settings: (settings: any) => Promise<any>,
    get_settings: () => Promise<any>,
    onUserText: (callback: (text: string) => void) => void,
    list_llm: () => Promise<any>,
    get_llm: (name: string) => Promise<any>,
    save_llm: (props: any) => Promise<any>,
    save_history: (props: any) => Promise<any>,
    onLoadHistory: (callback: (history: any) => void) => void,
}

interface Window {
    electronAPI: ElectronAPI;
}
