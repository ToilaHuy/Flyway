"use client"
import Image from 'next/image'
import {useState} from "react";

export default function Home() {
    const [nameStore,setNameStore] = useState()
    const [sql,setSql] = useState()
    const [generateSql, setGenerateSql] = useState("")
    const handNameStore = (e) => {
        setNameStore(e.target.value)
    }
    const handInputSql = (e) => {
        setSql(e.target.value)
    }
    const handGenerateSql = () => {
const text =
`
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[${nameStore}]'))
BEGIN
  EXEC sp_executesql N'CREATE PROCEDURE [dbo].[${nameStore}] AS select 1'
  PRINT 'Creating SP [dbo].[${nameStore}]'
END
GO
    ${sql}
GO
PRINT 'Altering SP [dbo].[${nameStore}]'
`
     setGenerateSql(text)
    }

  return (
    <main className=" min-h-screenh items-center p-24">
        <div className="flex gap-4 items-center">
            <div>
                    <input
                        type="text"
                        name="price"
                        id="price"
                        className="block h-12 w-full rounded-md border-0 py-1.5 pl-28 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Name store"
                        onChange={(e) =>handNameStore(e)}
                    />

            </div>
            <button className="bg-sky-500 h-12 p-2 rounded-lg" onClick={() =>handGenerateSql()}>Generate</button>
        </div>
        <div>Input here</div>
        <div>
            <textarea
                name="price"
                id="price"
                className="content-stretch w-full rounded-md border-0 py-1.5 pl-28 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 min-w-full"
                onChange={(e) =>handInputSql(e)}
            />
        </div>
        <div>Copy here</div>
        <div>
            <textarea
                name="price"
                id="price"
                className="block w-full rounded-md border-0 py-1.5 pl-28 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={generateSql}
            />
        </div>
    </main>
  )
}
