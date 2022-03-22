import { Listbox, Transition } from '@headlessui/react'
import { CogIcon } from '@heroicons/react/outline'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Fragment } from 'react'

import { classes } from '@/mods/shared/helpers/classes'

import { useProjectSettingsPanel } from '../settings'
import { useCurrentProject } from './useCurrentProject'

export const CurrentProjectSelector = () => {
  const { projects, currentProject, changeCurrentProject } = useCurrentProject()
  const { open } = useProjectSettingsPanel()

  return (
    <>
      <CogIcon
        className="h-6 w-6 text-gray-300 hover:text-gray-400"
        onClick={() => open()}
      />
      <Listbox
        value={currentProject}
        onChange={data => changeCurrentProject(data)}
      >
        {({ open }) => (
          <>
            <div className="w-full lg:w-2/5 md:w-1/2 max-w-xs relative">
              <Listbox.Button
                data-desc={`Project ID: ${currentProject?.ref}`}
                data-intent="Change current project"
                className="bg-gray-600 relative w-full border border-gray-700 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              >
                <span className="block truncate text-gray-300">
                  {currentProject?.name}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {projects.map(item => (
                    <Listbox.Option
                      key={item.ref}
                      className={({ active }) =>
                        classes(
                          active ? 'text-white bg-primary' : 'text-white',
                          'cursor-default select-none relative py-2 pl-3 pr-9'
                        )
                      }
                      value={item}
                      data-desc={`Project ID: ${item.ref}`}
                      data-intent="Change current project"
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classes(
                              selected || item.ref === currentProject?.ref
                                ? 'font-semibold'
                                : 'font-normal',
                              'block truncate'
                            )}
                            data-desc={`Project ID: ${item.ref}`}
                            data-intent="Change current project"
                          >
                            {item.name}
                          </span>

                          {selected || item.ref === currentProject?.ref ? (
                            <span
                              className={classes(
                                active ? 'text-white' : 'text-primary',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                              data-desc={`Project ID: ${item.ref}`}
                              data-intent="Change current project"
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </>
  )
}
