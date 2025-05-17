import React from 'react';
import { DayPicker } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { CalendarIcon } from 'lucide-react';

function DatePicker({ value, onChange }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="w-full justify-start text-left font-normal border border-gray-300 rounded-lg py-2 px-4 flex items-center text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? value.toLocaleDateString('ru-RU') : 'Выберите дату'}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <DayPicker
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}

export { DatePicker };