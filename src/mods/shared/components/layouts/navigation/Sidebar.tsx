import { Disclosure } from '@headlessui/react'
import Link from 'next/link'
import React from 'react'

import { classes } from '@/mods/shared/helpers/classes'

import { Logo } from '../Logo'
import { MobileMenu } from '.'
import { menu } from './menu'

export const Sidebar = () => {
  return (
    <>
      <div className="hidden w-28 dark:bg-gray-500 overflow-y-auto md:block">
        <div className="w-full py-6 flex flex-col items-center">
          <div className="flex-shrink-0 flex items-center">
            <Logo />
          </div>
          <div className="flex-1 mt-6 w-full px-2 space-y-1">
            {menu.map(item =>
              item.menu ? (
                <Disclosure as="div" key={item.name} className="space-y-1">
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className={classes(
                          open ? 'bg-dark-600' : '',
                          'text-gray-300 hover:bg-dark-600 hover:text-white',
                          'group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium'
                        )}
                      >
                        <item.icon
                          className={classes(
                            'text-gray-300 group-hover:text-white',
                            'h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        <span className="mt-2">{item.name}</span>
                      </Disclosure.Button>
                      <Disclosure.Panel className="space-y-1">
                        {item.menu.map(subItem => (
                          <Link key={subItem.name} href={subItem.href} passHref>
                            <a className="group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium text-gray-300 hover:bg-dark-600 hover:text-white">
                              {subItem.name}
                            </a>
                          </Link>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ) : (
                <Link key={item.name} href={item.href as string}>
                  <a
                    key={item.name}
                    onClick={item.onClick}
                    className={classes(
                      'text-gray-300 hover:bg-dark-600 hover:text-white',
                      'relative cursor-pointer group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium'
                    )}
                    target={item?.target ?? '_self'}
                  >
                    {item?.target === '_blank' && (
                      <span
                        className="pointer-events-none absolute top-2 right-2 text-gray-400 group-hover:text-gray-300"
                        aria-hidden="true"
                      >
                        <svg
                          className="h-3 w-3"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                        </svg>
                      </span>
                    )}
                    <item.icon
                      className={classes(
                        'text-gray-300 group-hover:text-white',
                        'h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    <span className="mt-2">{item.name}</span>
                  </a>
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      <MobileMenu />
    </>
  )
}
