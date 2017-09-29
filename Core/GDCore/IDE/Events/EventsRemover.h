/*
 * GDevelop Core
 * Copyright 2008-2016 Florian Rival (Florian.Rival@gmail.com). All rights reserved.
 * This project is released under the MIT License.
 */
#ifndef EventsRemover_H
#define EventsRemover_H
#include "GDCore/String.h"
#include <vector>
#include <set>
#include "GDCore/IDE/Events/ArbitraryEventsWorker.h"
namespace gd {class BaseEvent;}
namespace gd {class Project;}
namespace gd {class EventsList;}

namespace gd
{

/**
 * \brief List the values of the parameters of events and their type.
 *
 * \ingroup IDE
 */
class GD_CORE_API EventsRemover : public ArbitraryEventsWorker
{
public:
    EventsRemover() {};
    virtual ~EventsRemover();

    void AddEventToRemove(gd::BaseEvent & event) { eventsToRemove.insert(&event); }
    void AddInstructionToRemove(gd::Instruction & instruction) { instructionsToRemove.insert(&instruction); }

private:
    virtual bool DoVisitEvent(gd::BaseEvent & event)
    {
        return eventsToRemove.count(&event) != 0;
    }

    virtual bool DoVisitInstruction(gd::Instruction & instruction, bool isCondition)
    {
        return instructionsToRemove.count(&instruction) != 0;
    }

    std::set<gd::BaseEvent *> eventsToRemove;
    std::set<gd::Instruction *> instructionsToRemove;
};

}

#endif // EventsRemover_H
