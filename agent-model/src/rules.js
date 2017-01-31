function checkFact(antecedent, world) {
  // lazy hard-coding to world props for now, while we think about scoping
  let fact = antecedent.fact,
      property = fact.split(".")[1],
      val = world.props[property]
  if (antecedent.equals) {            // can have more comparators
    return val == antecedent.equals
  } else {
    return val
  }
}

function checkAntecedent(antecedent, agent, world) {
  if (antecedent.fact) {
    return checkFact(antecedent, world)
  } else if (antecedent.state) {
    return agent.state == antecedent.state
  }
}

function checkAntecedents(antecedents, agent, world) {
  if (antecedents.all) {
    for (let antecedent of antecedents.all) {
      if (!checkAntecedent(antecedent, agent, world)) {
        return false
      }
      return true
    }
  } else if (antecedents.any) {
    for (let antecedent of antecedents.any) {
      if (checkAntecedent(antecedent, agent, world)) {
        return true
      }
      return false
    }
  } else {
    return checkAntecedent(antecedents, agent, world)
  }
}

export default function runRules (agent, world) {
  let consequences = []
  for (let rule of agent.species.rules) {
    if (checkAntecedents(rule.if, agent, world)) {
      if (Array.isArray(rule.then)) {
        consequences = consequences.concat(rule.then)
      } else {
        consequences.push(rule.then)
      }
    }
  }
  return consequences
}
