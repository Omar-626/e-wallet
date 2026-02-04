import { useState, useRef, useEffect } from "react"



function WalletComponent() {

    const [accountHistory, setaccountHistory] = useState(() => {
        const storedHistory = localStorage.getItem("stored-history")
        return storedHistory ? JSON.parse(storedHistory) : []
    })
    const [historyFilter, setHistoryFilter] = useState("all")



    const [cash, setCash] = useState(() => {
        const storedCash = localStorage.getItem("stored-cash")
        return storedCash ? +storedCash : 0
    })
    const [insta, setInsta] = useState(() => {
        const storedInsta = localStorage.getItem("stored-insta")
        return storedInsta ? +storedInsta : 0
    })
    const [vodafone, setVodafone] = useState(() => {
        const storedVodafone = localStorage.getItem("stored-vodafone")
        return storedVodafone ? +storedVodafone : 0
    })

    const [tempEarnings, setTempEarnings] = useState("")
    const [tempEarningsDetails, setTempEarningsDetails] = useState("")
    const [tempExpensses, setTempExpensses] = useState("")
    const [tempExpenssesDetails, setTempExpenssesDetails] = useState("")


    const [tempType, setTempType] = useState("cash")



    const expenssesDialogRef = useRef(null)
    const earningsDialogRef = useRef(null)


    const handleTempExpensses = (e) => {
        const value = +e.target.value
        if (value > 0) {
            setTempExpensses(value)
        }
        if (value === 0) {
            setTempExpensses("")
        }
    }
    const handleTempEarnings = (e) => {
        const value = +e.target.value
        if (value > 0) {
            setTempEarnings(value)
        }
        if (value === 0) {
            setTempEarnings("")
        }
    }

    const handleAddingToHistory = (processType, moneyAmount, processDetails, moneyTool) => {
        const date = new Date()
        setaccountHistory(prevHistory => [...prevHistory, {
            type: processType,
            amount: moneyAmount,
            details: processDetails,
            tool: moneyTool,
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            hour: date.getHours(),
            minutes: date.getMinutes()
        }])
    }

    const handleConfirmAddExpensses = () => {

        if (tempExpensses > 0) {
            if (tempType === "cash") {
                const tempValue = cash - tempExpensses
                if (tempValue >= 0) {
                    setCash(() => cash - tempExpensses)
                    setTempExpenssesDetails(tempExpenssesDetails)
                    handleAddingToHistory("expensses", tempExpensses, tempExpenssesDetails, "cash")
                    setTempExpensses("")
                    setTempExpenssesDetails("")
                }
            }

            if (tempType === "insta") {
                const tempValue = insta - tempExpensses
                if (tempValue >= 0) {
                    setInsta(() => insta - tempExpensses)
                    setTempExpenssesDetails(tempExpenssesDetails)
                    handleAddingToHistory("expensses", tempExpensses, tempExpenssesDetails, "insta")
                    setTempExpensses("")
                    setTempExpenssesDetails("")
                }
            }
            if (tempType === "vodafone") {
                const tempValue = vodafone - tempExpensses
                if (tempValue >= 0) {
                    setVodafone(() => vodafone - tempExpensses)
                    setTempExpenssesDetails(tempExpenssesDetails)
                    handleAddingToHistory("expensses", tempExpensses, tempExpenssesDetails, "vodafone")
                    setTempExpensses("")
                    setTempExpenssesDetails("")
                }
            }
            expenssesDialogRef.current.close()
        }
    }


    const handleConfirmAddEarnings = () => {
        if (tempEarnings > 0) {
            if (tempType === "cash") {
                const tempValue = cash + tempEarnings
                setCash(tempValue)
                setTempEarningsDetails(tempEarningsDetails)
                handleAddingToHistory("earnings", tempEarnings, tempEarningsDetails, "cash")
                setTempEarnings("")
                setTempEarningsDetails("")
            }
            if (tempType === "insta") {
                const tempValue = insta + tempEarnings
                setInsta(tempValue)
                setTempEarningsDetails(tempEarningsDetails)
                handleAddingToHistory("earnings", tempEarnings, tempEarningsDetails, "insta")

                setTempEarnings("")
                setTempEarningsDetails("")
            }
            if (tempType === "vodafone") {
                const tempValue = vodafone + tempEarnings
                setVodafone(tempValue)
                setTempEarningsDetails(tempEarningsDetails)
                handleAddingToHistory("earnings", tempEarnings, tempEarningsDetails, "vodafone")

                setTempEarnings("")
                setTempEarningsDetails("")
            }
            earningsDialogRef.current.close()
        }
    }


    useEffect(() => {
        localStorage.setItem("stored-history", JSON.stringify(accountHistory))
    }, [accountHistory])

    useEffect(() => {
        localStorage.setItem("stored-cash", cash)
    }, [cash])
    useEffect(() => {
        localStorage.setItem("stored-insta", insta)
    }, [insta])
    useEffect(() => {
        localStorage.setItem("stored-vodafone", vodafone)
    }, [vodafone])

    const reversedHistory = accountHistory.slice().reverse()

    return (
        <div
            className="wrapper">
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", columnGap: "2px",
                backgroundColor: "#2c56d5"
            }}
                className="account">
                <div className="cash-account section">
                    <h3>نقدي</h3>
                    <p>{cash}</p>
                </div>
                <div className="insta-account section">
                    <h3>انستا باي</h3>
                    <p>{insta}</p>
                </div>
                <div className="vodafone-account section">
                    <h3>فودافون كاش</h3>
                    <p>{vodafone}</p>
                </div>
                <div className="total section" style={{ gridColumn: "1 / -1" }}>
                    <h2>الاجمالي</h2>
                    <p style={{ fontSize: "34px" }}>{cash + insta + vodafone}</p>
                </div>
            </div>
            <div className="add-expensses">
                <button onClick={() => expenssesDialogRef.current.show()} className=" btns-container">اضغط هنا لاضافة مصروفات</button>
            </div>
            <div className="add-earnings">
                <button onClick={() => earningsDialogRef.current.show()} className=" btns-container">اضغط هنا لاضافة واردات</button>
            </div>



            <dialog ref={expenssesDialogRef} className="expensses-dialog dialog">
                <input onChange={(e) => handleTempExpensses(e)} value={tempExpensses} className="dialog-input" inputMode="numeric" type="text" placeholder="أدخل قيمة المصروفات" />
                <input onChange={(e) => setTempExpenssesDetails(e.target.value)} value={tempExpenssesDetails} className="dialog-input" type="text" placeholder="أدخل التفاصيل (اختياري)" />
                <select onChange={(e) => setTempType(e.target.value)}
                    value={tempType} name="" id="" style={{ width: "100%", fontSize: "20px", margin: "10px auto" }}>
                    <option value="cash">نقدي</option>
                    <option value="insta">انستا باي</option>
                    <option value="vodafone">فودافون كاش</option>
                </select>
                <button onClick={handleConfirmAddExpensses} className="dialog-ok-btn">موافق</button>
                <button onClick={() => expenssesDialogRef.current.close()} className="dialog-cancel-btn">الغاء</button>
            </dialog>

            <dialog ref={earningsDialogRef} className="earnings-dialog dialog">
                <input onChange={(e) => handleTempEarnings(e)} value={tempEarnings} className="dialog-input" inputMode="numeric" type="text" placeholder="أدخل قيمة الواردات" />
                <input onChange={(e) => setTempEarningsDetails(e.target.value)} value={tempEarningsDetails} className="dialog-input" type="text" placeholder="أدخل التفاصيل (اختياري)" />
                <select onChange={(e) => setTempType(e.target.value)}
                    value={tempType} name="" id="" style={{ width: "100%", fontSize: "20px", margin: "10px auto" }}>
                    <option value="cash">نقدي</option>
                    <option value="insta">انستا باي</option>
                    <option value="vodafone">فودافون كاش</option>
                </select>
                <button onClick={handleConfirmAddEarnings} className="dialog-ok-btn">موافق</button>
                <button onClick={() => earningsDialogRef.current.close()} className="dialog-cancel-btn">الغاء</button>
            </dialog>


            {reversedHistory.length > 0 && <div className="history-container">
                <h3>سجل العمليات</h3>

                <div className="history-filters">
                    <button style={{ color: "black" }}
                        className={historyFilter === "all" ? "active" : ""}
                        onClick={() => setHistoryFilter("all")}
                    >
                        الكل
                    </button>
                    <button
                        className={historyFilter === "earnings" ? "active earnings-btn" : "earnings-btn"}
                        onClick={() => setHistoryFilter("earnings")}
                    >
                        واردات
                    </button>
                    <button
                        className={historyFilter === "expensses" ? "active expensses-btn" : "expensses-btn"}
                        onClick={() => setHistoryFilter("expensses")}
                    >
                        مصروفات
                    </button>
                </div>

                <div className="history-list">
                    {reversedHistory
                        .filter(item => {
                            if (historyFilter === "all") return true
                            return item.type === historyFilter
                        })
                        .map((item, index, arr) => {
                            const prevItem = arr[index - 1]

                            const isNewDay =
                                !prevItem ||
                                prevItem.day !== item.day ||
                                prevItem.month !== item.month ||
                                prevItem.year !== item.year

                            return (
                                <div key={index}>
                                    {isNewDay && (
                                        <div className="day-separator">
                                            <hr />
                                            <span>
                                                {item.day}/{item.month}/{item.year}
                                            </span>
                                        </div>
                                    )}

                                    <div
                                        className={`history-item ${item.type === "earnings" ? "earnings" : "expensses"
                                            }`}
                                    >
                                        <div className="history-row">
                                            <span className="history-type">
                                                {item.tool === "cash"
                                                    ? "نقدي"
                                                    : item.tool === "insta"
                                                        ? "انستا باي"
                                                        : "فودافون كاش"}
                                            </span>

                                            <span className="history-time">
                                                {item.hour}:
                                                {item.minutes}
                                            </span>

                                            <span className="history-amount">
                                                {item.type === "earnings" ? "+" : "-"}
                                                {item.amount}
                                            </span>
                                        </div>

                                        <div className="history-details">
                                            <p>{item.details || "بدون تفاصيل"}</p>
                                        </div>
                                    </div>

                                </div>
                            )
                        })}
                </div>
            </div>
            }




        </div >
    )
}

export default WalletComponent