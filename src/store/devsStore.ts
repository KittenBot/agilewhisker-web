import {create} from 'zustand'

export const useDevsStore = create<{
    code: string;
    params: Record<string, string>;
    setCode: (code: string) => void;
    setParams: (params: Record<string, string>) => void;
}>((set) => ({
    code: '// Write your code here',
    params: {},
    setCode: (code: string) => set({code}),
    setParams: (params) => set({params})
}))