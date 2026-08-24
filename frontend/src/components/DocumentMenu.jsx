import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { MoreVertical, Trash2 } from "lucide-react";

function DocumentMenu({ onDelete }) {
    return (
        <Menu as="div" className="relative">

            <MenuButton className="p-2 rounded-lg hover:bg-slate-100 transition">
                <MoreVertical size={20} />
            </MenuButton>

            <MenuItems className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border z-50 focus:outline-none">

                <MenuItem>
                    {({ active }) => (
                        <button
                            onClick={onDelete}
                            className={`${active ? "bg-red-50" : ""
                                } flex items-center gap-2 w-full px-4 py-3 text-red-600`}
                        >
                            <Trash2 size={18} />
                            Delete
                        </button>
                    )}
                </MenuItem>

            </MenuItems>

        </Menu>
    );
}

export default DocumentMenu;